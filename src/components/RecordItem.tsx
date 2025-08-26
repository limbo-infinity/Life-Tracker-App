import React from 'react';
interface Record {
  id: number;
  text: string;
  timestamp: string;
}
interface RecordItemProps {
  record: Record;
}
export function RecordItem({
  record
}: RecordItemProps) {
  return <div className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-500">
      <p className="text-gray-800">{record.text}</p>
      <p className="text-xs text-gray-500 mt-2">{record.timestamp}</p>
    </div>;
}