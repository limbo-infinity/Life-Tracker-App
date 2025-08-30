import React, { useEffect, useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { RecordPage } from './components/RecordPage';
import { ChatbotPage } from './components/ChatbotPage';
import { ArchivesPage } from './components/ArchivesPage';
import { SettingsPage } from './components/SettingsPage';
import { LoginPage } from './components/LoginPage';
import { supabase } from './lib/supabase';
import type { AuthUser } from './lib/supabase';

export function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('records');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>('20:00');
  const [composerAtTop, setComposerAtTop] = useState<boolean>(true);
  const [time24h, setTime24h] = useState<boolean>(false);
  const [showSeconds, setShowSeconds] = useState<boolean>(false);
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [recordColor, setRecordColor] = useState<string>('#3b82f6');
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
  const addRecord = (text: string, targetDate?: Date, imageData?: string) => {
    console.log('App.tsx addRecord called with:', { text, targetDate, imageData });
    const now = new Date();
    const recordDate = targetDate ? new Date(targetDate) : now;
    const newRecord = {
      id: Date.now(),
      text,
      timestamp: now.toLocaleString(),
      date: recordDate.toISOString().split('T')[0],
      imageData
    };
    console.log('New record created:', newRecord);
    console.log('Image data length:', newRecord.imageData?.length || 0);
    setRecords(prev => {
      const newRecords = [newRecord, ...prev];
      console.log('Updated records state, total records:', newRecords.length);
      return newRecords;
    });
  };
  const deleteRecord = (id: number) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };
  const editRecord = (id: number, newText: string) => {
    const now = new Date();
    setRecords(prev => prev.map(r => r.id === id ? { ...r, text: newText, timestamp: now.toLocaleString() } : r));
  };
  const updateRecordDate = (id: number, newDate: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, date: newDate } : r));
  };
  const goToDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      setCurrentDate(d);
      setCurrentPage('records');
    }
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
  const getAISummary = async (date: string): Promise<string> => {
    const dayRecords = records.filter(record => record.date === date);
    if (dayRecords.length === 0) return 'No activities recorded for this day.';
    
    // Use local intelligent analysis (simplified for now)
    return generateLocalSummary(dayRecords);
  };

  // Local intelligent summary generation
  const generateLocalSummary = (dayRecords: any[]) => {
    const activities = dayRecords.map(r => r.text.toLowerCase());
    
    // Categorize activities
    const categories = {
      physical: activities.filter(a => 
        a.includes('walk') || a.includes('run') || a.includes('exercise') || 
        a.includes('workout') || a.includes('gym') || a.includes('sport') ||
        a.includes('bike') || a.includes('swim') || a.includes('dance')
      ),
      mental: activities.filter(a => 
        a.includes('read') || a.includes('book') || a.includes('study') || 
        a.includes('learn') || a.includes('course') || a.includes('research')
      ),
      wellness: activities.filter(a => 
        a.includes('meditat') || a.includes('mindful') || a.includes('yoga') ||
        a.includes('breath') || a.includes('relax') || a.includes('rest')
      ),
      work: activities.filter(a => 
        a.includes('work') || a.includes('project') || a.includes('meeting') ||
        a.includes('deadline') || a.includes('client') || a.includes('presentation')
      ),
      social: activities.filter(a => 
        a.includes('friend') || a.includes('family') || a.includes('dinner') ||
        a.includes('party') || a.includes('call') || a.includes('visit')
      ),
      creative: activities.filter(a => 
        a.includes('write') || a.includes('draw') || a.includes('paint') ||
        a.includes('music') || a.includes('design') || a.includes('craft')
      ),
      health: activities.filter(a => 
        a.includes('cook') || a.includes('meal') || a.includes('sleep') ||
        a.includes('doctor') || a.includes('vitamin') || a.includes('water')
      )
    };

    // Generate insights
    let insights = [];
    let mood = 'productive';
    
    if (categories.physical.length > 0) {
      insights.push(`You were physically active with ${categories.physical.length} activit${categories.physical.length > 1 ? 'ies' : 'y'}`);
    }
    
    if (categories.mental.length > 0) {
      insights.push(`You invested in learning with ${categories.mental.length} intellectual pursuit${categories.mental.length > 1 ? 's' : ''}`);
    }
    
    if (categories.wellness.length > 0) {
      insights.push(`You prioritized mental wellbeing`);
      mood = 'balanced';
    }
    
    if (categories.work.length > 0) {
      insights.push(`You made progress on ${categories.work.length} work-related task${categories.work.length > 1 ? 's' : ''}`);
      mood = 'focused';
    }
    
    if (categories.social.length > 0) {
      insights.push(`You connected with others socially`);
      mood = 'social';
    }
    
    if (categories.creative.length > 0) {
      insights.push(`You expressed your creativity`);
      mood = 'inspired';
    }
    
    if (categories.health.length > 0) {
      insights.push(`You took care of your health`);
    }

    // Determine overall day type
    let dayType = 'balanced';
    if (categories.physical.length >= 2) dayType = 'active';
    if (categories.work.length >= 2) dayType = 'productive';
    if (categories.wellness.length >= 2) dayType = 'mindful';
    if (categories.social.length >= 2) dayType = 'social';
    
    // Generate summary
    let summary = `Today was a ${dayType} day with ${dayRecords.length} recorded activities. `;
    
    if (insights.length > 0) {
      summary += insights.slice(0, 3).join('. ') + '. ';
    }
    
    // Add mood and recommendations
    summary += `Your day had a ${mood} energy. `;
    
    if (categories.physical.length === 0 && dayRecords.length > 2) {
      summary += 'Consider adding some physical activity tomorrow for better balance.';
    } else if (categories.wellness.length === 0 && dayRecords.length > 2) {
      summary += 'A moment of mindfulness could enhance your day.';
    } else if (insights.length >= 3) {
      summary += 'Great job maintaining a well-rounded lifestyle!';
    }
    
    return summary;
  };
  // Persistence: load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('records');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecords(parsed);
        }
      }
      const storedSort = localStorage.getItem('sortNewestFirst');
      if (storedSort !== null) setSortNewestFirst(storedSort === 'true');
      const storedReminderEnabled = localStorage.getItem('reminderEnabled');
      if (storedReminderEnabled !== null) setReminderEnabled(storedReminderEnabled === 'true');
      const storedReminderTime = localStorage.getItem('reminderTime');
      if (storedReminderTime) setReminderTime(storedReminderTime);
      const storedComposerAtTop = localStorage.getItem('composerAtTop');
      if (storedComposerAtTop !== null) setComposerAtTop(storedComposerAtTop === 'true');
      const storedTime24h = localStorage.getItem('time24h');
      if (storedTime24h !== null) setTime24h(storedTime24h === 'true');
      const storedShowSeconds = localStorage.getItem('showSeconds');
      if (storedShowSeconds !== null) setShowSeconds(storedShowSeconds === 'true');
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') setTheme(storedTheme);
      const storedRecordColor = localStorage.getItem('recordColor');
      if (storedRecordColor) setRecordColor(storedRecordColor);
      const storedAiSummary = localStorage.getItem('aiSummaryEnabled');
      if (storedAiSummary !== null) setAiSummaryEnabled(storedAiSummary === 'true');
    } catch {}
  }, []);
  // Save records when changed
  useEffect(() => {
    try {
      localStorage.setItem('records', JSON.stringify(records));
    } catch {}
  }, [records]);
  // Save sort order
  useEffect(() => {
    try {
      localStorage.setItem('sortNewestFirst', String(sortNewestFirst));
    } catch {}
  }, [sortNewestFirst]);

  useEffect(() => {
    try {
      localStorage.setItem('composerAtTop', String(composerAtTop));
    } catch {}
  }, [composerAtTop]);

  useEffect(() => {
    try {
      localStorage.setItem('time24h', String(time24h));
      localStorage.setItem('showSeconds', String(showSeconds));
    } catch {}
  }, [time24h, showSeconds]);

  useEffect(() => {
    try { localStorage.setItem('aiSummaryEnabled', String(aiSummaryEnabled)); } catch {}
  }, [aiSummaryEnabled]);

  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('recordColor', recordColor); } catch {}
    document.documentElement.style.setProperty('--record-accent', recordColor);
  }, [recordColor]);

  // Notifications: daily reminder scheduling
  const reminderTimeoutRef = useRef<number | null>(null);
  const scheduleNextReminder = () => {
    if (!reminderEnabled) return;
    // Clear existing
    if (reminderTimeoutRef.current) {
      window.clearTimeout(reminderTimeoutRef.current);
      reminderTimeoutRef.current = null;
    }
    const [hoursStr, minutesStr] = reminderTime.split(':');
    const hours = parseInt(hoursStr || '20', 10);
    const minutes = parseInt(minutesStr || '0', 10);
    const now = new Date();
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);
    if (next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 1);
    }
    const msUntil = next.getTime() - now.getTime();
    const timeoutId = window.setTimeout(async () => {
      try {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('Time to journal', { body: 'Add a quick note to your Life Tracker.' });
          } else if (Notification.permission !== 'denied') {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
              new Notification('Time to journal', { body: 'Add a quick note to your Life Tracker.' });
            }
          }
        }
      } finally {
        // Schedule the next one for the following day
        scheduleNextReminder();
      }
    }, msUntil);
    reminderTimeoutRef.current = timeoutId;
  };

  useEffect(() => {
    try {
      localStorage.setItem('reminderEnabled', String(reminderEnabled));
      localStorage.setItem('reminderTime', reminderTime);
    } catch {}
    // Only schedule when enabled
    if (reminderEnabled) {
      scheduleNextReminder();
    } else if (reminderTimeoutRef.current) {
      window.clearTimeout(reminderTimeoutRef.current);
      reminderTimeoutRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminderEnabled, reminderTime]);

  // Authentication effect
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at || ''
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || ''
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={() => {}} />;
  }

      return <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} addRecord={(text: string, targetDate?: Date, imageData?: string) => addRecord(text, targetDate, imageData)} onLogout={handleLogout}>
      {currentPage === 'records' && <RecordPage records={sortedRecords} addRecord={(text: string, targetDate?: Date, imageData?: string) => addRecord(text, targetDate || currentDate, imageData)} currentDate={currentDate} navigateDay={navigateDay} deleteRecord={deleteRecord} editRecord={editRecord} composerAtTop={composerAtTop} time24h={time24h} showSeconds={showSeconds} getAISummary={getAISummary} aiSummaryEnabled={aiSummaryEnabled} />}
      {currentPage === 'chatbot' && <ChatbotPage records={records} />}
      {currentPage === 'archives' && <ArchivesPage records={records} getAISummary={getAISummary} updateRecordDate={updateRecordDate} goToDate={goToDate} />}
      {currentPage === 'settings' && <SettingsPage sortNewestFirst={sortNewestFirst} setSortNewestFirst={setSortNewestFirst} records={records} setRecords={setRecords} reminderEnabled={reminderEnabled} setReminderEnabled={setReminderEnabled} reminderTime={reminderTime} setReminderTime={setReminderTime} composerAtTop={composerAtTop} setComposerAtTop={setComposerAtTop} time24h={time24h} setTime24h={setTime24h} showSeconds={showSeconds} setShowSeconds={setShowSeconds} theme={theme} setTheme={setTheme} recordColor={recordColor} setRecordColor={setRecordColor} aiSummaryEnabled={aiSummaryEnabled} setAiSummaryEnabled={setAiSummaryEnabled} />}
    </Layout>;
}