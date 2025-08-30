import React, { useState } from 'react';
import { PlusIcon, ImageIcon } from 'lucide-react';
interface AddRecordFormProps {
  addRecord: (text: string, imageData?: string) => void;
}
export function AddRecordForm({
  addRecord
}: AddRecordFormProps) {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addRecord(text, imageData || undefined);
      setText('');
      setImageData(null);
    }
  };
  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  };
  return <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-dashed border-2" style={{ borderColor: 'var(--record-accent, #3b82f6)' }}>
      <textarea className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100" placeholder="What did you accomplish today?" rows={3} value={text} onChange={e => setText(e.target.value)} />
      <div className="flex justify-between items-center mt-2">
        <label className="flex items-center px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200 cursor-pointer">
          <ImageIcon size={16} className="mr-1" /> Image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) handleFile(file);
          }} />
        </label>
        <button
          type="submit"
          className={`px-4 py-2 rounded flex items-center ${text.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} dark:${text.trim() ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}
          disabled={!text.trim()}
          aria-disabled={!text.trim()}
        >
          <PlusIcon size={16} className="mr-1" />
          Add Record
        </button>
      </div>
      {imageData && <div className="mt-3"><img src={imageData} alt="attachment" className="max-h-48 rounded" /></div>}
    </form>;
}