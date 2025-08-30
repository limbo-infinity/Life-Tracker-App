import React, { useState } from 'react';
import { PlusIcon, ImageIcon } from 'lucide-react';
interface AddRecordFormProps {
  addRecord: (text: string, targetDate?: Date, imageData?: string) => void;
}
export function AddRecordForm({
  addRecord
}: AddRecordFormProps) {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AddRecordForm submit with:', { text, imageData, hasImage: !!imageData });
    
    // Allow submission if there's either text or an image
    if (text.trim() || imageData) {
      try {
        addRecord(text.trim(), undefined, imageData || undefined);
        console.log('Record added successfully');
        setText('');
        setImageData(null);
      } catch (error) {
        console.error('Error adding record:', error);
        alert('Error adding record. Please try again.');
      }
    }
  };
  const handleFile = async (file: File) => {
    console.log('File selected:', { name: file.name, type: file.type, size: file.size });
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      console.log('Image converted to base64, length:', result.length);
      setImageData(result);
    };
    reader.readAsDataURL(file);
  };
  return <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-dashed border-2" style={{ borderColor: 'var(--record-accent, #3b82f6)' }}>
      <textarea className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100" placeholder="What did you accomplish today? (or just add an image below)" rows={3} value={text} onChange={e => setText(e.target.value)} />
      <div className="flex justify-between items-center mt-2">
        <label className={`flex items-center px-3 py-2 rounded cursor-pointer transition-colors ${
          imageData 
            ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200' 
            : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          <ImageIcon size={16} className="mr-1" /> 
          {imageData ? 'Image ✓' : 'Image'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) handleFile(file);
          }} />
        </label>
        <button
          type="submit"
          className={`px-4 py-2 rounded flex items-center ${(text.trim() || imageData) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} dark:${(text.trim() || imageData) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}
          disabled={!(text.trim() || imageData)}
          aria-disabled={!(text.trim() || imageData)}
        >
          <PlusIcon size={16} className="mr-1" />
          Add Record
        </button>
      </div>
      {imageData && (
        <div className="mt-3 relative">
          <img src={imageData} alt="attachment" className="max-h-48 rounded" />
          <button
            type="button"
            onClick={() => setImageData(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}
      {/* {!text.trim() && !imageData && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Tip: You can add just an image or just text - both are optional!
        </div>
      )} */}
    </form>;
}