import React from 'react';
import { Navigation } from './Navigation';
interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}
export function Layout({
  children,
  currentPage,
  setCurrentPage
}: LayoutProps) {
  return <div className="flex flex-col w-full h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-16">{children}</main>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>;
}