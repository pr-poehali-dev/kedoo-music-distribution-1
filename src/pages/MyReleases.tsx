import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { AuthContextType } from '@/App';

interface MyReleasesProps {
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
  status: 'draft' | 'moderation' | 'approved' | 'rejected';
  rejectionReason?: string;
  coverImage: string;
  tracks: any[];
  createdAt: string;
}

const MyReleases = ({ authContext, toggleTheme, theme }: MyReleasesProps) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadReleases();
  }, [authContext.user]);

  const loadReleases = () => {
    const allReleases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    const userReleases = allReleases.filter((r: Release) => r.userEmail === authContext.user?.email);
    setReleases(userReleases);
  };

  const deleteRelease = (id: string) => {
    const allReleases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    const updated = allReleases.filter((r: Release) => r.id !== id);
    localStorage.setItem('kedoo_releases', JSON.stringify(updated));
    loadReleases();
    toast.success('Релиз удален');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; icon: string }> = {
      draft: { variant: 'secondary', label: 'Черновик', icon: 'FileEdit' },
      moderation: { variant: 'default', label: 'На модерации', icon: 'Clock' },
      approved: { variant: 'default', label: 'Одобрен', icon: 'CheckCircle2' },
      rejected: { variant: 'destructive', label: 'Отклонен', icon: 'XCircle' },
    };
    const config = variants[status] || variants.draft;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon name={config.icon as any} size={12} />
        {config.label}
      </Badge>
    );
  };

  const filterByStatus = (status: string) => {
    if (status === 'all') return releases;
    return releases.filter(r => r.status === status);
  };

  const ReleaseCard = ({ release }: { release: Release }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <img
            src={release.coverImage}
            alt={release.title}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{release.title}</h3>
                <p className="text-muted-foreground">{release.artist}</p>
                <p className="text-sm text-muted-foreground">{release.genre}</p>
              </div>
              {getStatusBadge(release.status)}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Music" size={14} />
                {release.tracks.length} треков
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={14} />
                {new Date(release.createdAt).toLocaleDateString()}
              </span>
            </div>

            {release.status === 'rejected' && release.rejectionReason && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-destructive mb-1">Причина отклонения:</p>
                <p className="text-sm">{release.rejectionReason}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {release.status === 'draft' && (
                <Button size="sm" variant="outline">
                  <Icon name="Edit" size={14} className="mr-1" />
                  Редактировать
                </Button>
              )}
              {release.status === 'rejected' && (
                <>
                  <Button size="sm" variant="outline">
                    <Icon name="Edit" size={14} className="mr-1" />
                    Редактировать
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteRelease(release.id)}>
                    <Icon name="Trash2" size={14} className="mr-1" />
                    Удалить
                  </Button>
                </>
              )}
              {release.status === 'draft' && (
                <Button size="sm" variant="destructive" onClick={() => deleteRelease(release.id)}>
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Удалить
                </Button>
              )}
              {release.status === 'approved' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Icon name="Eye" size={14} className="mr-1" />
                      Подробнее
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{release.title}</DialogTitle>
                      <DialogDescription>Информация о релизе</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <img src={release.coverImage} alt={release.title} className="w-40 h-40 rounded-lg" />
                        <div className="space-y-2">
                          <p><strong>Исполнитель:</strong> {release.artist}</p>
                          <p><strong>Жанр:</strong> {release.genre}</p>
                          <p><strong>Треков:</strong> {release.tracks.length}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Треклист:</h4>
                        {release.tracks.map((track, i) => (
                          <div key={i} className="p-2 bg-muted rounded mb-2">
                            {i + 1}. {track.title} - {track.performers}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Мои релизы</h1>
            <p className="text-muted-foreground">Управляйте вашими релизами</p>
          </div>
          <Button onClick={() => navigate('/add-release')} className="gradient-primary">
            <Icon name="PlusCircle" size={18} className="mr-2" />
            Добавить релиз
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Все ({releases.length})</TabsTrigger>
            <TabsTrigger value="draft">Черновики ({filterByStatus('draft').length})</TabsTrigger>
            <TabsTrigger value="moderation">Модерация ({filterByStatus('moderation').length})</TabsTrigger>
            <TabsTrigger value="approved">Одобрено ({filterByStatus('approved').length})</TabsTrigger>
            <TabsTrigger value="rejected">Отклонено ({filterByStatus('rejected').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {releases.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">У вас пока нет релизов</CardTitle>
                  <CardDescription className="text-center">
                    Начните с добавления вашего первого релиза
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={() => navigate('/add-release')} className="gradient-primary">
                    <Icon name="PlusCircle" size={18} className="mr-2" />
                    Добавить первый релиз
                  </Button>
                </CardContent>
              </Card>
            ) : (
              releases.map(release => <ReleaseCard key={release.id} release={release} />)
            )}
          </TabsContent>

          {['draft', 'moderation', 'approved', 'rejected'].map(status => (
            <TabsContent key={status} value={status} className="space-y-4 mt-6">
              {filterByStatus(status).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Нет релизов с этим статусом
                  </CardContent>
                </Card>
              ) : (
                filterByStatus(status).map(release => <ReleaseCard key={release.id} release={release} />)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyReleases;
