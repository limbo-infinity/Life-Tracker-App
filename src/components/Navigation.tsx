import React from 'react';
import { MessageSquareIcon, BookOpenIcon, ArchiveIcon, SettingsIcon } from 'lucide-react';
interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}
export function Navigation({
  currentPage,
  setCurrentPage
}: NavigationProps) {
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <button className={`flex flex-col items-center justify-center w-1/4 py-1 ${currentPage === 'chatbot' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentPage('chatbot')}>
          <MessageSquareIcon size={24} />
          <span className="text-xs mt-1">Chatbot</span>
        </button>
        <button className={`flex flex-col items-center justify-center w-1/4 py-1 ${currentPage === 'records' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentPage('records')}>
          <BookOpenIcon size={24} />
          <span className="text-xs mt-1">Records</span>
        </button>
        <button className={`flex flex-col items-center justify-center w-1/4 py-1 ${currentPage === 'archives' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentPage('archives')}>
          <ArchiveIcon size={24} />
          <span className="text-xs mt-1">Archives</span>
        </button>
        <button className={`flex flex-col items-center justify-center w-1/4 py-1 ${currentPage === 'settings' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => setCurrentPage('settings')}>
          <SettingsIcon size={24} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>;
}