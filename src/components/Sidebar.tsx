import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, LayoutTemplate, BarChart, Star, FileSignature, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { t } = useTranslation();

  const navLinks = [
    { name: t('header.dashboard'), path: '/dashboard', icon: Home },
    { name: t('header.myResumes'), path: '/my-resumes', icon: FileText },
    { name: t('header.coverLetters', 'My Cover Letters'), path: '/my-cover-letters', icon: FileSignature },
    { name: t('header.coverLetterGenerator', 'AI Cover Letter'), path: '/cover-letter-generator', icon: Wand2 },
    { name: t('header.templates'), path: '/templates', icon: LayoutTemplate },
    { name: t('header.atsAnalyzer'), path: '/ats-analyzer', icon: BarChart },
    { name: t('header.pricing'), path: '/pricing', icon: Star },
  ];

  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
  const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800";
  const activeClasses = "bg-primary text-primary-foreground";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-primary">{t('brand')}</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
         {/* Future settings link can go here */}
      </div>
    </aside>
  );
};

export default Sidebar;