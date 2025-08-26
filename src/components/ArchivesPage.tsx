import React, { useState } from 'react';
import { ArchiveIcon, CalendarIcon } from 'lucide-react';
interface Record {
  id: number;
  text: string;
  timestamp: string;
  date: string;
}
interface ArchivesPageProps {
  records: Record[];
  getAISummary: (date: string) => string;
}
export function ArchivesPage({
  records,
  getAISummary
}: ArchivesPageProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Get dates with records
  const datesWithRecords = [...new Set(records.map(record => record.date))];
  // Calculate calendar data
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Create calendar grid
    const calendarDays = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      calendarDays.push({
        day,
        date: dateStr,
        hasRecords: datesWithRecords.includes(dateStr)
      });
    }
    return calendarDays;
  };
  const calendar = generateCalendar(currentMonth);
  // Navigate to previous or next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };
  // Get records for the selected date
  const selectedDateRecords = selectedDate ? records.filter(record => record.date === selectedDate) : [];
  // Format the month name
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  return <div className="px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-3 rounded-full mr-3">
          <ArchiveIcon size={24} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Archives</h1>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigateMonth('prev')} className="p-2 text-gray-600 hover:text-gray-900">
            &lt;
          </button>
          <h2 className="font-medium text-lg">{formatMonth(currentMonth)}</h2>
          <button onClick={() => navigateMonth('next')} className="p-2 text-gray-600 hover:text-gray-900">
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="text-center text-sm text-gray-500 font-medium">
              {day}
            </div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, index) => <button key={index} className={`
                aspect-square flex items-center justify-center rounded-full text-sm
                ${!day ? 'invisible' : ''}
                ${day?.hasRecords ? 'font-medium' : 'text-gray-400'}
                ${selectedDate === day?.date ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
              `} disabled={!day || !day.hasRecords} onClick={() => day && setSelectedDate(day.date)}>
              {day?.day}
              {day?.hasRecords && <span className={`w-1 h-1 rounded-full absolute bottom-1 
                  ${selectedDate === day.date ? 'bg-white' : 'bg-blue-500'}`}></span>}
            </button>)}
        </div>
      </div>

      {/* Selected date summary */}
      {selectedDate && <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium text-lg mb-2">
            {new Date(selectedDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start">
              <CalendarIcon size={20} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{getAISummary(selectedDate)}</p>
            </div>
          </div>
          <h4 className="font-medium mb-2">Activities</h4>
          {selectedDateRecords.map(record => <div key={record.id} className="border-l-2 border-green-500 pl-3 py-1 mb-3">
              <p className="text-gray-800">{record.text}</p>
              <p className="text-xs text-gray-500">
                {record.timestamp.split(' ')[1]}
              </p>
            </div>)}
        </div>}
    </div>;
}