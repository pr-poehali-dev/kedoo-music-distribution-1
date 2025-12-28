import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { AuthContextType } from '@/App';
import { useEffect, useState } from 'react';

interface DashboardProps {
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

interface Release {
  id: string;
  title: string;
  artist: string;
  status: 'draft' | 'moderation' | 'approved' | 'rejected';
  createdAt: string;
}

const Dashboard = ({ authContext, toggleTheme, theme }: DashboardProps) => {
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    const allReleases = JSON.parse(localStorage.getItem('kedoo_releases') || '[]');
    const userReleases = allReleases.filter((r: Release & { userEmail: string }) => 
      r.userEmail === authContext.user?.email
    );
    setReleases(userReleases.slice(0, 3));
  }, [authContext.user]);

  const stats = [
    { label: 'Всего релизов', value: releases.length, icon: 'Disc3', color: 'from-primary to-secondary' },
    { label: 'На модерации', value: releases.filter(r => r.status === 'moderation').length, icon: 'Clock', color: 'from-accent to-primary' },
    { label: 'Одобрено', value: releases.filter(r => r.status === 'approved').length, icon: 'CheckCircle2', color: 'from-secondary to-accent' },
  ];

  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Добро пожаловать, {authContext.user?.email.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Управляйте своими релизами и отслеживайте статистику
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden hover:scale-105 transition-transform duration-300">
              <CardHeader className={`gradient-primary bg-gradient-to-br ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{stat.label}</CardTitle>
                  <Icon name={stat.icon as any} size={24} className="text-white/80" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PlusCircle" size={24} />
                Быстрые действия
              </CardTitle>
              <CardDescription>Начните работу с kedoo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/add-release" className="block">
                <Button className="w-full gradient-primary hover:opacity-90 transition-opacity justify-start">
                  <Icon name="Upload" size={18} className="mr-2" />
                  Добавить новый релиз
                </Button>
              </Link>
              <Link to="/my-releases" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="Disc3" size={18} className="mr-2" />
                  Посмотреть все релизы
                </Button>
              </Link>
              <Link to="/tickets" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="MessageSquare" size={18} className="mr-2" />
                  Создать тикет поддержки
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={24} />
                Последние релизы
              </CardTitle>
              <CardDescription>Ваши недавние работы</CardDescription>
            </CardHeader>
            <CardContent>
              {releases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Disc3" size={48} className="mx-auto mb-4 opacity-20" />
                  <p>У вас пока нет релизов</p>
                  <Link to="/add-release">
                    <Button className="mt-4 gradient-primary">
                      Добавить первый релиз
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {releases.map((release) => (
                    <div key={release.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="Music" size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{release.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{release.artist}</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        release.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        release.status === 'moderation' ? 'bg-yellow-500/20 text-yellow-400' :
                        release.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {release.status === 'draft' ? 'Черновик' :
                         release.status === 'moderation' ? 'Модерация' :
                         release.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
