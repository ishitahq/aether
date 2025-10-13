'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { HomeIcon, MapIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/lib/theme';

const Navigation = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/map', label: 'Map', icon: MapIcon },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[100] px-4 py-4"
    >
      <div className="w-full">
        <div className="glass-morphism rounded-2xl px-6 py-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-xl border border-white/20">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Aether</h1>
                <p className="text-xs text-slate-400">Thermal Imaging Platform</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative px-4 py-2 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-400 shadow-lg shadow-blue-500/25' 
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl border border-blue-500/30"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 glass-morphism-dark rounded-xl hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-slate-300" />
              ) : (
                <MoonIcon className="w-5 h-5 text-slate-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
