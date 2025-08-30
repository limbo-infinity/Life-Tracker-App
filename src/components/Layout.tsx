import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { LogOut, UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  addRecord?: (text: string) => void;
  onLogout?: () => void;
}

export function Layout({
  children,
  currentPage,
  setCurrentPage,
  addRecord,
  onLogout
}: LayoutProps) {
  const [userName, setUserName] = useState('');

  const getButtonPosition = (page: string) => {
    switch (page) {
      case 'records':
        return 'bottom-40 right-4';
      case 'chatbot':
        return 'bottom-40 right-4';
      case 'archives':
        return 'bottom-28 right-4';
      case 'settings':
        return 'bottom-20 right-4';
      default:
        return 'bottom-40 right-4';
    }
  };
  // Quick capture: global keyboard hortcut Cmd/Ctrl+J
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        const text = window.prompt('Quick capture note');
        if (text && text.trim() && addRecord) addRecord(text.trim());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [addRecord]);

  // Load user name on component mount
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setUserName(fullName);
        }
      } catch (error) {
        console.error('Error loading user name:', error);
      }
    };
    loadUserName();
  }, []);

  return <div className="flex flex-col w-full h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* User info and logout button */}
      {onLogout && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Welcome back,</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-10 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 rounded-lg"
            title="Sign out"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {addRecord && currentPage !== 'settings' && currentPage !== 'records'
      && <button onClick={() => {
        const text = window.prompt('Quick capture note');
        if (text && text.trim()) addRecord(text.trim());
      }} className={`fixed ${getButtonPosition(currentPage)} text-white rounded-full p-4 shadow-lg focus:outline-none transition-all duration-300 ease-in-out cursor-pointer z-50`} style={{ backgroundColor: 'var(--record-accent, #3b82f6)' }} aria-label="Quick add note">+
      </button>}
    </div>;
}
