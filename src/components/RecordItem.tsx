import React from 'react';
interface Record {
  id: number;
  text: string;
  timestamp: string;
  date?: string;
  createdAt?: number;
  imageData?: string;
}
interface RecordItemProps {
  record: Record;
  time24h?: boolean;
  showSeconds?: boolean;
}
export function RecordItem({
  record,
  time24h = false,
  showSeconds = false
}: RecordItemProps) {
  const formatTime = () => {
    const date = record.createdAt ? new Date(record.createdAt) : new Date(record.timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: showSeconds ? '2-digit' : undefined,
      hour12: !time24h
    });
  };
  return <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 border-l-4" style={{ borderLeftColor: 'var(--record-accent, #3b82f6)' }}>
      <p className="text-gray-800 dark:text-gray-100 break-words whitespace-pre-wrap">{record.text}</p>
      {record.imageData && <div className="mt-2"><img src={record.imageData} alt="attachment" className="max-h-48 rounded" /></div>}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{formatTime()}</p>
    </div>;
}