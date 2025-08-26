import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
interface AddRecordFormProps {
  addRecord: (text: string) => void;
}
export function AddRecordForm({
  addRecord
}: AddRecordFormProps) {
  const [text, setText] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addRecord(text);
      setText('');
    }
  };
  return <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow border-dashed border-2 border-gray-300">
      <textarea className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What did you accomplish today?" rows={3} value={text} onChange={e => setText(e.target.value)} />
      <div className="flex justify-end mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center" disabled={!text.trim()}>
          <PlusIcon size={16} className="mr-1" />
          Add Record
        </button>
      </div>
    </form>;
}