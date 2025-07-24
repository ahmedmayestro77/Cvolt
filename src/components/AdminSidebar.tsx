import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    // Future links like { name: 'Users', path: '/admin/users', icon: Users } can be added here
  ];

  const baseClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
  const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800";
  const activeClasses = "bg-primary text-primary-foreground";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) => cn(baseClasses, isActive ? activeClasses : inactiveClasses)}
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;