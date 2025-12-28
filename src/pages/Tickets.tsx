import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { AuthContextType } from '@/App';

interface TicketsProps {
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

interface Ticket {
  id: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  response?: string;
  createdAt: string;
}

const Tickets = ({ authContext, toggleTheme, theme }: TicketsProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [authContext.user]);

  const loadTickets = () => {
    const allTickets = JSON.parse(localStorage.getItem('kedoo_tickets') || '[]');
    const userTickets = allTickets.filter((t: Ticket) => t.userEmail === authContext.user?.email);
    setTickets(userTickets);
  };

  const createTicket = () => {
    if (!subject || !message) {
      toast.error('Заполните все поля');
      return;
    }

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: authContext.user!.email,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    const allTickets = JSON.parse(localStorage.getItem('kedoo_tickets') || '[]');
    allTickets.push(newTicket);
    localStorage.setItem('kedoo_tickets', JSON.stringify(allTickets));

    setSubject('');
    setMessage('');
    setIsDialogOpen(false);
    loadTickets();
    toast.success('Тикет создан');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string; icon: string }> = {
      open: { variant: 'default', label: 'Открыт', icon: 'Clock' },
      answered: { variant: 'secondary', label: 'Отвечен', icon: 'CheckCircle2' },
      closed: { variant: 'outline', label: 'Закрыт', icon: 'XCircle' },
    };
    const c = config[status];
    return (
      <Badge variant={c.variant} className="flex items-center gap-1">
        <Icon name={c.icon as any} size={12} />
        {c.label}
      </Badge>
    );
  };

  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Поддержка</h1>
            <p className="text-muted-foreground">Создавайте тикеты для связи с модераторами</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать тикет
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый тикет</DialogTitle>
                <DialogDescription>Опишите вашу проблему или вопрос</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Тема</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Краткое описание проблемы"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Подробно опишите вашу проблему"
                    rows={5}
                  />
                </div>
                <Button onClick={createTicket} className="w-full gradient-primary">
                  Отправить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {tickets.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">У вас пока нет тикетов</CardTitle>
              <CardDescription className="text-center">
                Создайте тикет, если у вас есть вопросы или проблемы
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Icon name="MessageSquare" size={64} className="text-muted-foreground opacity-20" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                      <CardDescription>
                        {new Date(ticket.createdAt).toLocaleDateString()} в {new Date(ticket.createdAt).toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Ваше сообщение:</p>
                    <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                  </div>
                  {ticket.response && (
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-2 text-primary">Ответ модератора:</p>
                      <p className="text-sm whitespace-pre-wrap">{ticket.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tickets;
