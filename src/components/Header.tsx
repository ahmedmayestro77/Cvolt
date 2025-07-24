import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Languages, User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { showError } from '@/utils/toast';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { session, supabase } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: t('header.dashboard'), path: '/dashboard' },
    { name: t('header.templates'), path: '/templates' },
    { name: t('header.myResumes'), path: '/my-resumes' },
    { name: t('header.coverLetters', 'Cover Letters'), path: '/my-cover-letters' },
    { name: t('header.atsAnalyzer'), path: '/ats-analyzer' },
    { name: t('header.pricing'), path: '/pricing' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = i18n.dir(lng);
    document.documentElement.lang = lng;
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Error signing out. Please try again.');
    } else {
      navigate('/');
    }
  };

  const userInitial = session?.user?.email?.[0].toUpperCase() ?? '?';

  // For logged-out users, show a different header
  if (!session) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">{t('brand')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
                changeLanguage(nextLang);
              }}
              aria-label="Change language"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Link to="/auth">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Header for logged-in users (part of AppLayout)
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('header.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
               {/* Re-using Sidebar component for mobile to ensure consistency */}
               <div className="flex flex-col h-full">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="font-bold text-2xl text-primary">{t('brand')}</span>
                  </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link key={link.path} to={link.path}>
                      <Button variant="ghost" className="w-full justify-start text-lg">
                        {link.name}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
            changeLanguage(nextLang);
          }}
          aria-label="Change language"
        >
          <Languages className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.user_metadata.avatar_url} alt={session.user.email} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;