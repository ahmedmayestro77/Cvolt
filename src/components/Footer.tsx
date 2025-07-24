import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="font-bold text-2xl text-primary">{t('brand')}</span>
          </Link>
          <div className="flex flex-col items-center md:flex-row gap-4 text-gray-600 dark:text-gray-400">
            <Link to="/templates" className="hover:text-primary transition-colors">{t('header.templates')}</Link>
            <Link to="/pricing" className="hover:text-primary transition-colors">{t('header.pricing')}</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">{t('header.contact')}</Link>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p>&copy; {new Date().getFullYear()} CVOLT. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};