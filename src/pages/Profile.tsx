import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { AuthContextType } from '@/App';

interface ProfileProps {
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Profile = ({ authContext, toggleTheme, theme }: ProfileProps) => {
  return (
    <Layout authContext={authContext} toggleTheme={toggleTheme} theme={theme}>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Профиль</h1>
          <p className="text-muted-foreground">Управление аккаунтом</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" size={24} />
              Информация о пользователе
            </CardTitle>
            <CardDescription>Ваши личные данные</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                <Icon name="User" size={32} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{authContext.user?.email.split('@')[0]}</p>
                <p className="text-sm text-muted-foreground">{authContext.user?.email}</p>
                {authContext.user?.isModerator && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      <Icon name="Shield" size={12} />
                      Модератор
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={authContext.user?.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Роль</Label>
                <Input value={authContext.user?.isModerator ? 'Модератор' : 'Пользователь'} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Settings" size={24} />
              Настройки
            </CardTitle>
            <CardDescription>Персонализация интерфейса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Тема оформления</p>
                <p className="text-sm text-muted-foreground">Переключение между светлой и темной темой</p>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={18} className="mr-2" />
                {theme === 'dark' ? 'Светлая' : 'Темная'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Icon name="LogOut" size={24} />
              Выход из аккаунта
            </CardTitle>
            <CardDescription>Завершить текущую сессию</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={authContext.logout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
