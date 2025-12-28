import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { AuthContextType } from '@/App';

interface ModeratorPanelProps {
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

interface Release {
  id: string;
  userEmail: string;
  title: string;
  artist: string;
  genre: string;
  status: string;
  coverImage: string;
  tracks: any[];
  createdAt: string;
  upc?: string;
  rejectionReason?: string;
}

interface Ticket {
  id: string;
  userEmail: string;
  subject: string;
  message: string;
  status: string;
  response?: string;
  createdAt: string;
}

const ModeratorPanel = ({ authContext, toggleTheme, theme }: ModeratorPanelProps) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [upcInput, setUpcInput] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketResponse, setTicketResponse] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allReleases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    setReleases(allReleases.filter((r: Release) => r.status === 'moderation'));

    const allTickets = JSON.parse(localStorage.getItem('kedoo_tickets') || '[]');
    setTickets(allTickets.filter((t: Ticket) => t.status === 'open'));
  };

  const approveRelease = (releaseId: string) => {
    const allReleases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    const updated = allReleases.map((r: Release) =>
      r.id === releaseId ? { ...r, status: 'approved', upc: upcInput || r.upc } : r
    );
    localStorage.setItem('kedoo_releases', JSON.stringify(updated));
    setUpcInput('');
    setSelectedRelease(null);
    loadData();
    toast.success('Релиз одобрен');
  };

  const rejectRelease = (releaseId: string) => {
    if (!rejectionReason) {
      toast.error('Укажите причину отклонения');
      return;
    }
    const allReleases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    const updated = allReleases.map((r: Release) =>
      r.id === releaseId ? { ...r, status: 'rejected', rejectionReason } : r
    );
    localStorage.setItem('kedoo_releases', JSON.stringify(updated));
    setRejectionReason('');
    setSelectedRelease(null);
    loadData();
    toast.success('Релиз отклонен');
  };

  const downloadReleaseFiles = (release: Release) => {
    const dataStr = JSON.stringify(release, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `release-${release.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Файлы скачаны');
  };

  const answerTicket = (ticketId: string) => {
    if (!ticketResponse) {
      toast.error('Напишите ответ');
      return;
    }
    const allTickets = JSON.parse(localStorage.getItem('kedoo_tickets') || '[]');
    const updated = allTickets.map((t: Ticket) =>
      t.id === ticketId ? { ...t, status: 'answered', response: ticketResponse } : t
    );
    localStorage.setItem('kedoo_tickets', JSON.stringify(updated));
    setTicketResponse('');
    setSelectedTicket(null);
    loadData();
    toast.success('Ответ отправлен');
  };

  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Icon name="Shield" size={36} />
            Панель модератора
          </h1>
          <p className="text-muted-foreground">Управление релизами и тикетами</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gradient-primary bg-gradient-to-br from-primary to-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Релизов на модерации</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{releases.length}</p>
            </CardContent>
          </Card>
          <Card className="gradient-primary bg-gradient-to-br from-accent to-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Открытых тикетов</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{tickets.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="releases" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="releases">Релизы на модерации ({releases.length})</TabsTrigger>
            <TabsTrigger value="tickets">Тикеты ({tickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="releases" className="space-y-4 mt-6">
            {releases.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Нет релизов на модерации
                </CardContent>
              </Card>
            ) : (
              releases.map((release) => (
                <Card key={release.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={release.coverImage}
                        alt={release.title}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold">{release.title}</h3>
                          <p className="text-muted-foreground">{release.artist}</p>
                          <p className="text-sm text-muted-foreground">
                            Пользователь: {release.userEmail} • Жанр: {release.genre}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Music" size={14} />
                          <span>{release.tracks.length} треков</span>
                          <span className="mx-2">•</span>
                          <Icon name="Calendar" size={14} />
                          <span>{new Date(release.createdAt).toLocaleDateString()}</span>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRelease(release)}>
                              <Icon name="Eye" size={14} className="mr-1" />
                              Подробнее
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{release.title}</DialogTitle>
                              <DialogDescription>Модерация релиза</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex gap-4">
                                <img src={release.coverImage} alt="" className="w-40 h-40 rounded-lg" />
                                <div className="space-y-2">
                                  <p><strong>Исполнитель:</strong> {release.artist}</p>
                                  <p><strong>Жанр:</strong> {release.genre}</p>
                                  <p><strong>Треков:</strong> {release.tracks.length}</p>
                                  <p><strong>Пользователь:</strong> {release.userEmail}</p>
                                  {release.upc && <p><strong>UPC:</strong> {release.upc}</p>}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Треклист:</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {release.tracks.map((track, i) => (
                                    <div key={i} className="p-3 bg-muted rounded-lg text-sm">
                                      <p className="font-semibold">{i + 1}. {track.title}</p>
                                      <p className="text-muted-foreground">Исполнители: {track.performers}</p>
                                      <p className="text-muted-foreground">Автор музыки: {track.musicAuthor}</p>
                                      <p className="text-muted-foreground">Автор слов: {track.lyricsAuthor}</p>
                                      <p className="text-muted-foreground">Язык: {track.language}</p>
                                      {track.isrc && <p className="text-muted-foreground">ISRC: {track.isrc}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <Label>UPC (заполните при одобрении)</Label>
                                  <Input
                                    value={upcInput}
                                    onChange={(e) => setUpcInput(e.target.value)}
                                    placeholder="Введите UPC"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Причина отклонения</Label>
                                  <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Опишите причину отклонения"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => approveRelease(release.id)}
                                    className="flex-1 gradient-primary"
                                  >
                                    <Icon name="CheckCircle2" size={16} className="mr-2" />
                                    Одобрить
                                  </Button>
                                  <Button
                                    onClick={() => rejectRelease(release.id)}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    <Icon name="XCircle" size={16} className="mr-2" />
                                    Отклонить
                                  </Button>
                                  <Button
                                    onClick={() => downloadReleaseFiles(release)}
                                    variant="outline"
                                  >
                                    <Icon name="Download" size={16} className="mr-2" />
                                    Скачать
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4 mt-6">
            {tickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Нет открытых тикетов
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                        <CardDescription>
                          От: {ticket.userEmail} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="default">
                        <Icon name="Clock" size={12} className="mr-1" />
                        Открыт
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedTicket(ticket)}
                          className="gradient-primary"
                        >
                          <Icon name="MessageSquare" size={16} className="mr-2" />
                          Ответить
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ответ на тикет</DialogTitle>
                          <DialogDescription>{ticket.subject}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-semibold mb-2">Вопрос пользователя:</p>
                            <p className="text-sm">{ticket.message}</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Ваш ответ</Label>
                            <Textarea
                              value={ticketResponse}
                              onChange={(e) => setTicketResponse(e.target.value)}
                              placeholder="Напишите ответ пользователю"
                              rows={5}
                            />
                          </div>
                          <Button
                            onClick={() => answerTicket(ticket.id)}
                            className="w-full gradient-primary"
                          >
                            <Icon name="Send" size={16} className="mr-2" />
                            Отправить ответ
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ModeratorPanel;
