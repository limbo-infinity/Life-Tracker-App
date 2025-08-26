import React from 'react';
import { RecordItem } from './RecordItem';
import { AddRecordForm } from './AddRecordForm';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
interface Record {
  id: number;
  text: string;
  timestamp: string;
  date?: string;
}
interface RecordPageProps {
  records: Record[];
  addRecord: (text: string) => void;
  currentDate: Date;
  navigateDay: (direction: 'prev' | 'next') => void;
}
export function RecordPage({
  records,
  addRecord,
  currentDate,
  navigateDay
}: RecordPageProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };
  return <div className="px-4 py-6 max-w-md mx-auto">
      {/* Date navigation header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateDay('prev')} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {formatDate(currentDate)}
        </h1>
        <button onClick={() => navigateDay('next')} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRightIcon size={24} />
        </button>
      </div>
      {records.length === 0 ? <div className="text-center py-8 text-gray-500">
          No records for this day. Add your first record below!
        </div> : <>
          {/* Top records */}
          <div className="mb-6">
            {records.slice(0, Math.ceil(records.length / 2)).map(record => <RecordItem key={record.id} record={record} />)}
          </div>
        </>}
      {/* Add new record form */}
      <div className="my-8">
        <AddRecordForm addRecord={addRecord} />
      </div>
      {records.length > 0 /* Bottom records */ && <div className="mt-6">
          {records.slice(Math.ceil(records.length / 2)).map(record => <RecordItem key={record.id} record={record} />)}
        </div>}
    </div>;
}