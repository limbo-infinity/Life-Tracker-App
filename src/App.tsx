import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { RecordPage } from './components/RecordPage';
import { ChatbotPage } from './components/ChatbotPage';
import { ArchivesPage } from './components/ArchivesPage';
import { SettingsPage } from './components/SettingsPage';
export function App() {
  const [currentPage, setCurrentPage] = useState('records');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  // Sample initial records
  const [records, setRecords] = useState([{
    id: 1,
    text: 'Morning walk for 30 minutes',
    timestamp: '2023-08-15 08:30',
    date: '2023-08-15'
  }, {
    id: 2,
    text: "Read 20 pages of 'Atomic Habits'",
    timestamp: '2023-08-15 10:15',
    date: '2023-08-15'
  }, {
    id: 3,
    text: 'Meditation session for 10 minutes',
    timestamp: '2023-08-15 12:00',
    date: '2023-08-15'
  }, {
    id: 4,
    text: 'Completed work project ahead of deadline',
    timestamp: '2023-08-14 16:45',
    date: '2023-08-14'
  }, {
    id: 5,
    text: 'Cooked a healthy dinner',
    timestamp: '2023-08-16 19:30',
    date: '2023-08-16'
  }]);
  const addRecord = (text: string) => {
    const now = new Date();
    const newRecord = {
      id: Date.now(),
      text,
      timestamp: now.toLocaleString(),
      date: now.toISOString().split('T')[0]
    };
    setRecords([newRecord, ...records]);
  };
  // Get records for the current date
  const currentDateStr = currentDate.toISOString().split('T')[0];
  const currentRecords = records.filter(record => record.date === currentDateStr);
  // Sort records based on user preference
  const sortedRecords = [...currentRecords].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortNewestFirst ? dateB - dateA : dateA - dateB;
  });
  // Navigate to previous or next day
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };
  // Get AI summary for a specific date
  const getAISummary = (date: string) => {
    const dayRecords = records.filter(record => record.date === date);
    if (dayRecords.length === 0) return 'No activities recorded for this day.';
    // This would ideally call an AI API, but for demo purposes we'll generate a simple summary
    const activities = dayRecords.map(r => r.text.toLowerCase());
    let summary = `On this day, you ${activities.join(', and you ')}. `;
    if (activities.some(a => a.includes('walk') || a.includes('exercise') || a.includes('workout'))) {
      summary += 'You were physically active today! ';
    }
    if (activities.some(a => a.includes('read') || a.includes('book') || a.includes('study'))) {
      summary += 'You invested in your knowledge. ';
    }
    if (activities.some(a => a.includes('meditat') || a.includes('mindful'))) {
      summary += 'You took time for mental wellbeing. ';
    }
    return summary;
  };
  return <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === 'records' && <RecordPage records={sortedRecords} addRecord={addRecord} currentDate={currentDate} navigateDay={navigateDay} />}
      {currentPage === 'chatbot' && <ChatbotPage records={records} />}
      {currentPage === 'archives' && <ArchivesPage records={records} getAISummary={getAISummary} />}
      {currentPage === 'settings' && <SettingsPage sortNewestFirst={sortNewestFirst} setSortNewestFirst={setSortNewestFirst} />}
    </Layout>;
}