import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Header = () => {
  const navLinks = [
    { name: 'لوحة التحكم', path: '/dashboard' },
    { name: 'القوالب', path: '/templates' },
    { name: 'سيرتي الذاتية', path: '/my-resumes' },
    { name: 'تحليل ATS', path: '/ats-analyzer' },
    { name: 'الأسعار', path: '/pricing' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">CVOLT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button variant="ghost" className="text-base">
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-6">
                <Link to="/" className="mb-4">
                  <span className="font-bold text-2xl text-primary">CVOLT</span>
                </Link>
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path}>
                    <Button variant="ghost" className="w-full justify-start text-lg">
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;