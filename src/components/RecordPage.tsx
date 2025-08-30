import React, { useState, useEffect } from 'react';
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
  addRecord: (text: string, targetDate?: Date, imageData?: string) => void;
  currentDate: Date;
  navigateDay: (direction: 'prev' | 'next') => void;
  deleteRecord?: (id: number) => void;
  editRecord?: (id: number, newText: string) => void;
  composerAtTop?: boolean;
  time24h?: boolean;
  showSeconds?: boolean;
  getAISummary?: (date: string) => string | Promise<string>;
  aiSummaryEnabled?: boolean;
}
export function RecordPage({
  records,
  addRecord,
  currentDate,
  navigateDay,
  deleteRecord,
  editRecord,
  composerAtTop = true,
  time24h = false,
  showSeconds = false,
  getAISummary,
  aiSummaryEnabled = true
}: RecordPageProps) {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Load AI summary when component mounts or date changes
  useEffect(() => {
    if (getAISummary && aiSummaryEnabled) {
      setIsLoadingSummary(true);
      const loadSummary = async () => {
        try {
          const summary = await getAISummary(currentDate.toISOString().split('T')[0]);
          setAiSummary(typeof summary === 'string' ? summary : '');
        } catch (error) {
          console.error('Error loading AI summary:', error);
          setAiSummary('');
        } finally {
          setIsLoadingSummary(false);
        }
      };
      loadSummary();
    }
  }, [getAISummary, aiSummaryEnabled, currentDate]);

  const formatDate = (date: Date) => {
    const shortOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', shortOptions);
  };
  return <div className="px-4 py-6 max-w-md mx-auto">
      {/* Date navigation header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateDay('prev')} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon size={24} />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap text-center flex-1">
          {formatDate(currentDate)}
        </h1>
        <button onClick={() => navigateDay('next')} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRightIcon size={24} />
        </button>
      </div>
      {/* Composer at top or between top/bottom lists */}
      {composerAtTop && <div className="my-4 composer-animate">
          <AddRecordForm addRecord={addRecord} />
        </div>}
      {/* Hint when empty */}
      {records.length === 0 && <div className="text-center py-6 text-gray-500">
          No records for this day. Use the box {composerAtTop ? 'above' : 'here'} to add one.
        </div>}
      {/* AI summary for the day */}
      {aiSummaryEnabled && (aiSummary || isLoadingSummary) && (
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">AI summary</p>
          {isLoadingSummary ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing your day...</span>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-200">{aiSummary}</p>
          )}
        </div>
      )}
      {/* Top chunk (when middle mode, up to two above the composer) */}
      {!composerAtTop && records.length > 0 && <div className="space-y-4">
          {records.slice(0, Math.min(2, records.length)).map(record => <div key={record.id} className="record-item relative transition-all duration-300">
              <RecordItem record={record} time24h={time24h} showSeconds={showSeconds} />
              <div className="absolute top-2 right-2 space-x-2 text-xs">
                {editRecord && <button onClick={() => {
                  const text = window.prompt('Edit note', record.text);
                  if (text !== null && text.trim()) editRecord(record.id, text.trim());
                }} className="text-blue-500">Edit</button>}
                {deleteRecord && <button onClick={() => deleteRecord(record.id)} className="text-red-500">Delete</button>}
              </div>
            </div>)}
        </div>}
      {/* Composer in the middle */}
      {!composerAtTop && <div className="my-4 composer-animate">
          <AddRecordForm addRecord={addRecord} />
        </div>}
      {/* Remaining records under the composer (or all when top mode) */}
      {records.length > 0 && <div className="records-list space-y-4">
          {(composerAtTop ? records : records.slice(Math.min(2, records.length))).map(record => <div key={record.id} className="record-item relative transition-all duration-300">
              <RecordItem record={record} time24h={time24h} showSeconds={showSeconds} />
              <div className="absolute top-2 right-2 space-x-2 text-xs">
                {editRecord && <button onClick={() => {
                  const text = window.prompt('Edit note', record.text);
                  if (text !== null && text.trim()) editRecord(record.id, text.trim());
                }} className="text-blue-500">Edit</button>}
                {deleteRecord && <button onClick={() => deleteRecord(record.id)} className="text-red-500">Delete</button>}
              </div>
            </div>)}
        </div>}
    </div>;
}