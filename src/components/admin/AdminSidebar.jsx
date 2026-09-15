import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, LogOut, Sun, Moon, Menu, X } from 'lucide-react';

export default function AdminSidebar({
  navTabs,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  handleSignOut
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-8 h-8 object-contain" />
          <h2 className="font-heading font-extrabold text-sm text-zinc-900 dark:text-white tracking-wide">Misis Siomai CMS</h2>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Content (Hidden on mobile unless open) */}
      <aside className={`${isMobileOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shrink-0 flex-col h-[calc(100vh-73px)] md:h-full overflow-hidden absolute md:relative z-40`}>
        
        <div className="hidden md:flex p-6 border-b border-gray-200 dark:border-zinc-800 items-center gap-3 shrink-0">
          <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="font-heading font-extrabold text-base text-zinc-900 dark:text-white tracking-wide">Misis Siomai</h2>
            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">CMS CONTROL</span>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto scrollbar-hide">
          {navTabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileOpen(false); // Auto-close on mobile
                }}
                className={`w-full px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${isActive
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-zinc-900 dark:text-white shadow-lg shadow-rose-900/40'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800/80'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className="w-4 h-4" />
                  <span>{tab.name}</span>
                </div>
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-400 text-zinc-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-3 shrink-0">
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="w-full py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex-1 py-2 px-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleSignOut}
              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-600 dark:text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
