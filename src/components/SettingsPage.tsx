import React from 'react';
import { SettingsIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
interface SettingsPageProps {
  sortNewestFirst: boolean;
  setSortNewestFirst: (value: boolean) => void;
}
e
export function SettingsPage({
  sortNewestFirst,
  setSortNewestFirst
}: SettingsPageProps) {
  return <div className="px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-8">
        <div className="bg-gray-100 p-4 rounded-full mr-3">
          <SettingsIcon size={32} className="text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Record Display</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sort Order</p>
            <p className="text-sm text-gray-500">
              Choose how your records are displayed
            </p>
          </div>
          <button onClick={() => setSortNewestFirst(!sortNewestFirst)} className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            {sortNewestFirst ? <>
                <ArrowDownIcon size={16} className="mr-1" />
                Newest First
              </> : <>
                <ArrowUpIcon size={16} className="mr-1" />
                Oldest First
              </>}
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-medium text-lg mb-2">About</h2>
        <p className="text-gray-600">Life Tracker v1.0</p>
        <p className="text-sm text-gray-500 mt-1">
          Track your daily activities and get insights about your habits.
        </p>
      </div>
    </div>;
}