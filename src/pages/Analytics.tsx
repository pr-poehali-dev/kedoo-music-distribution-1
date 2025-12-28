import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { AuthContextType } from '@/App';

interface AnalyticsProps {
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Analytics = ({ authContext, toggleTheme, theme }: AnalyticsProps) => {
  const platforms = [
    { name: 'Spotify', streams: 45200, growth: '+12%', color: 'bg-green-500' },
    { name: 'Apple Music', streams: 32800, growth: '+8%', color: 'bg-red-500' },
    { name: 'YouTube Music', streams: 28400, growth: '+15%', color: 'bg-red-600' },
    { name: 'Yandex Music', streams: 18900, growth: '+10%', color: 'bg-yellow-500' },
    { name: 'VK Music', streams: 12300, growth: '+5%', color: 'bg-blue-600' },
  ];

  const countries = [
    { name: 'Россия', streams: 58400, percentage: 42 },
    { name: 'Казахстан', streams: 21200, percentage: 15 },
    { name: 'Украина', streams: 18900, percentage: 14 },
    { name: 'Беларусь', streams: 15600, percentage: 11 },
    { name: 'США', streams: 12700, percentage: 9 },
    { name: 'Другие', streams: 12600, percentage: 9 },
  ];

  const monthlyData = [
    { month: 'Янв', streams: 8200 },
    { month: 'Фев', streams: 12400 },
    { month: 'Мар', streams: 15800 },
    { month: 'Апр', streams: 21300 },
    { month: 'Май', streams: 28900 },
    { month: 'Июн', streams: 35400 },
  ];

  const maxStreams = Math.max(...monthlyData.map(d => d.streams));

  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Аналитика</h1>
          <p className="text-muted-foreground">Отслеживайте успех ваших релизов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="gradient-primary bg-gradient-to-br from-primary to-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Всего прослушиваний</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">139.4K</p>
              <p className="text-xs text-white/80 mt-1">+18% за месяц</p>
            </CardContent>
          </Card>
          <Card className="gradient-primary bg-gradient-to-br from-accent to-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Уникальные слушатели</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">28.7K</p>
              <p className="text-xs text-white/80 mt-1">+23% за месяц</p>
            </CardContent>
          </Card>
          <Card className="gradient-primary bg-gradient-to-br from-secondary to-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Средний чек</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">₽2,847</p>
              <p className="text-xs text-white/80 mt-1">+5% за месяц</p>
            </CardContent>
          </Card>
          <Card className="gradient-primary bg-gradient-to-br from-primary/80 to-secondary/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Активные релизы</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-xs text-white/80 mt-1">На всех платформах</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="platforms" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platforms">По платформам</TabsTrigger>
            <TabsTrigger value="countries">По странам</TabsTrigger>
            <TabsTrigger value="timeline">По времени</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Прослушивания по платформам</CardTitle>
                <CardDescription>Распределение по музыкальным сервисам</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {platforms.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{platform.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{platform.streams.toLocaleString()}</span>
                        <span className="text-green-500 font-medium">{platform.growth}</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`${platform.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${(platform.streams / 45200) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>География слушателей</CardTitle>
                <CardDescription>Прослушивания по странам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {countries.map((country, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{country.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {country.streams.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-500"
                              style={{ width: `${country.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {country.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      {countries.map((country, index) => {
                        const offset = countries
                          .slice(0, index)
                          .reduce((sum, c) => sum + c.percentage, 0);
                        return (
                          <div
                            key={index}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(from ${offset * 3.6}deg, hsl(var(--primary)) 0deg ${
                                country.percentage * 3.6
                              }deg, transparent ${country.percentage * 3.6}deg)`,
                            }}
                          />
                        );
                      })}
                      <div className="absolute inset-8 rounded-full bg-card flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold">139.4K</p>
                          <p className="text-sm text-muted-foreground">прослушиваний</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика прослушиваний</CardTitle>
                <CardDescription>Статистика за последние 6 месяцев</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-80 flex items-end gap-4">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-muted rounded-t-lg overflow-hidden h-full flex flex-col justify-end">
                          <div
                            className="w-full gradient-primary transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                            style={{ height: `${(data.streams / maxStreams) * 100}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                              {data.streams.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Средний рост</p>
                      <p className="text-2xl font-bold text-green-500">+47%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Лучший месяц</p>
                      <p className="text-2xl font-bold">Июнь</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Прогноз на месяц</p>
                      <p className="text-2xl font-bold">42.8K</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={24} />
              Топ треков
            </CardTitle>
            <CardDescription>Самые популярные треки за последний месяц</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Summer Vibes', streams: 18400, trend: '+24%' },
                { title: 'Midnight City', streams: 15200, trend: '+18%' },
                { title: 'Electric Dreams', streams: 12800, trend: '+15%' },
                { title: 'Lost in Sound', streams: 9600, trend: '+12%' },
                { title: 'Neon Lights', streams: 7300, trend: '+8%' },
              ].map((track, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <span className="text-2xl font-bold text-muted-foreground w-8">{index + 1}</span>
                  <Icon name="Music" size={32} className="text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">{track.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {track.streams.toLocaleString()} прослушиваний
                    </p>
                  </div>
                  <span className="text-green-500 font-semibold">{track.trend}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
