import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { AuthContextType } from '@/App';

interface LayoutProps {
  children: ReactNode;
  authContext: AuthContextType;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Layout = ({ children, authContext, toggleTheme, theme }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: 'LayoutDashboard' },
    { path: '/add-release', label: 'Добавить релиз', icon: 'PlusCircle' },
    { path: '/my-releases', label: 'Мои релизы', icon: 'Disc3' },
    { path: '/analytics', label: 'Аналитика', icon: 'BarChart3' },
    { path: '/tickets', label: 'Поддержка', icon: 'MessageSquare' },
    { path: '/profile', label: 'Профиль', icon: 'User' },
  ];

  if (authContext.user?.isModerator) {
    navItems.push({ path: '/moderator', label: 'Модерация', icon: 'Shield' });
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Icon name="Music" size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">kedoo</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    className={location.pathname === item.path ? 'gradient-primary' : ''}
                    size="sm"
                  >
                    <Icon name={item.icon as any} size={16} className="mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
              </Button>
              <Button variant="ghost" size="sm" onClick={authContext.logout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>

          <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className={location.pathname === item.path ? 'gradient-primary' : ''}
                  size="sm"
                >
                  <Icon name={item.icon as any} size={16} className="mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
