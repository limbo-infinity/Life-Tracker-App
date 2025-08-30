import React, { useRef, useState } from 'react';
import { SettingsIcon, ArrowDownIcon, ArrowUpIcon, UserIcon, MailIcon, LockIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SettingsPageProps {
  sortNewestFirst: boolean;
  setSortNewestFirst: (value: boolean) => void;
  records?: Array<{ id: number; text: string; timestamp: string; date: string }>;
  setRecords?: (records: Array<{ id: number; text: string; timestamp: string; date: string }>) => void;
  reminderEnabled?: boolean;
  setReminderEnabled?: (value: boolean) => void;
  reminderTime?: string;
  setReminderTime?: (value: string) => void;
  composerAtTop?: boolean;
  setComposerAtTop?: (value: boolean) => void;
  time24h?: boolean;
  setTime24h?: (value: boolean) => void;
  showSeconds?: boolean;
  setShowSeconds?: (value: boolean) => void;
  theme?: 'light' | 'dark';
  setTheme?: (value: 'light' | 'dark') => void;
  recordColor?: string;
  setRecordColor?: (value: string) => void;
  aiSummaryEnabled?: boolean;
  setAiSummaryEnabled?: (value: boolean) => void;
}

export function SettingsPage({
  sortNewestFirst,
  setSortNewestFirst,
  records = [],
  setRecords,
  reminderEnabled = false,
  setReminderEnabled,
  reminderTime = '20:00',
  setReminderTime,
  composerAtTop = true,
  setComposerAtTop,
  time24h = false,
  setTime24h,
  showSeconds = false,
  setShowSeconds,
  theme = 'light',
  setTheme,
  recordColor = '#3b82f6',
  setRecordColor,
  aiSummaryEnabled = true,
  setAiSummaryEnabled
}: SettingsPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: ''
  });
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // Load user profile on component mount
  React.useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserProfile({
            full_name: user.user_metadata?.full_name || '',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    loadUserProfile();
    
    // Load AI configuration from localStorage
    const storedAiKey = localStorage.getItem('aiApiKey');
    const storedAiEnabled = localStorage.getItem('aiEnabled');
    if (storedAiKey) setAiApiKey(storedAiKey);
    if (storedAiEnabled !== null) setAiEnabled(storedAiEnabled === 'true');
  }, []);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setProfileMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: userProfile.full_name }
      });
      
      if (error) throw error;
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (error: any) {
      setProfileMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }
    
    if (passwordChange.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setPasswordMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordChange.newPassword
      });
      
      if (error) throw error;
      setPasswordMessage('Password updated successfully!');
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error: any) {
      setPasswordMessage(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiConfigUpdate = async () => {
    setIsLoading(true);
    setAiMessage('');
    
    try {
      // Save AI configuration to localStorage
      localStorage.setItem('aiApiKey', aiApiKey);
      localStorage.setItem('aiEnabled', String(aiEnabled));
      
      setAiMessage('AI configuration updated successfully!');
      setTimeout(() => setAiMessage(''), 3000);
    } catch (error: any) {
      setAiMessage('Failed to update AI configuration');
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mr-3">
          <SettingsIcon size={32} className="text-gray-600 dark:text-gray-200" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <div className="flex items-center mb-4">
          <UserIcon size={20} className="text-gray-600 dark:text-gray-200 mr-2" />
          <h2 className="font-medium text-lg">Personal Information</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={userProfile.full_name}
              onChange={(e) => setUserProfile(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="flex items-center">
              <MailIcon size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-400">{userProfile.email}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed from settings</p>
          </div>

          {profileMessage && (
            <div className={`text-sm p-3 rounded-md ${
              profileMessage.includes('successfully') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {profileMessage}
            </div>
          )}

          <button
            onClick={handleProfileUpdate}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <div className="flex items-center mb-4">
          <LockIcon size={20} className="text-gray-600 dark:text-gray-200 mr-2" />
          <h2 className="font-medium text-lg">Change Password</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordChange.newPassword}
              onChange={(e) => setPasswordChange(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordChange.confirmPassword}
              onChange={(e) => setPasswordChange(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Confirm new password"
            />
          </div>

          {passwordMessage && (
            <div className={`text-sm p-3 rounded-md ${
              passwordMessage.includes('successfully') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {passwordMessage}
            </div>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={isLoading || !passwordChange.newPassword || !passwordChange.confirmPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="font-medium text-lg">AI Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="sk-... (your OpenAI API key)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a>
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Enable Real AI</p>
              <p className="text-sm text-gray-500">Use OpenAI for intelligent responses</p>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`px-3 py-2 rounded-lg w-24 text-center transition-colors ${
                aiEnabled 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {aiEnabled ? 'On' : 'Off'}
            </button>
          </div>

          {aiMessage && (
            <div className={`text-sm p-3 rounded-md ${
              aiMessage.includes('successfully') 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {aiMessage}
            </div>
          )}

          <button
            onClick={handleAiConfigUpdate}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Updating...' : 'Update AI Configuration'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Appearance</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-gray-500">Light or dark mode</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => setTheme && setTheme('light')} className={`px-3 py-2 rounded-lg ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Light</button>
            <button onClick={() => setTheme && setTheme('dark')} className={`px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Dark</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Record color</p>
            <p className="text-sm text-gray-500">Accent color on records</p>
          </div>
          <input type="color" value={recordColor} onChange={(e) => setRecordColor && setRecordColor(e.target.value)} className="w-10 h-10 p-0 border border-gray-300 dark:border-gray-600 rounded bg-transparent" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Composer Position</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Add box placement</p>
            <p className="text-sm text-gray-500">Show add box at top or middle</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-stretch w-full max-w-xs">
            <button onClick={() => setComposerAtTop && setComposerAtTop(true)} className={`px-3 py-2 rounded-lg w-full sm:w-28 text-center ${composerAtTop ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Top</button>
            <button onClick={() => setComposerAtTop && setComposerAtTop(false)} className={`px-3 py-2 rounded-lg w-full sm:w-28 text-center ${!composerAtTop ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>Middle</button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Time Display</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">24-hour clock</p>
            <p className="text-sm text-gray-500">Toggle between 12h and 24h</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            <button onClick={() => setTime24h && setTime24h(!time24h)} className="flex items-center bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg w-full sm:w-28 justify-center">{time24h ? '24h' : '12h'}</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Show seconds</p>
            <p className="text-sm text-gray-500">Include seconds in time</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            <button onClick={() => setShowSeconds && setShowSeconds(!showSeconds)} className="flex items-center bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg w-full sm:w-28 justify-center">{showSeconds ? 'On' : 'Off'}</button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Record Display</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sort Order</p>
            <p className="text-sm text-gray-500">
              Choose how your records are displayed
            </p>
          </div>
          <button onClick={() => setSortNewestFirst(!sortNewestFirst)} className="flex items-center bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg">
            {sortNewestFirst ? <>
                <ArrowDownIcon size={16} className="mr-1" />
                Newest First
              </> : <>
                <ArrowUpIcon size={16} className="mr-1" />
                Oldest First
              </>}
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="font-medium">AI summary</p>
            <p className="text-sm text-gray-500">Show the AI summary box at the top</p>
          </div>
          <button onClick={() => setAiSummaryEnabled && setAiSummaryEnabled(!aiSummaryEnabled)} className={`px-3 py-2 rounded-lg w-24 text-center ${aiSummaryEnabled ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>{aiSummaryEnabled ? 'On' : 'Off'}</button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Backup</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">Export data</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Download your notes as JSON</p>
          </div>
          <button onClick={() => {
            const blob = new Blob([JSON.stringify({ records }, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const dateStr = new Date().toISOString().split('T')[0];
            a.download = `life-tracker-backup-${dateStr}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }} className="flex items-center bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg">Export</button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">Import data</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Restore notes from JSON</p>
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={async (e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              try {
                const text = await file.text();
                const json = JSON.parse(text);
                if (Array.isArray(json.records) && setRecords) {
                  setRecords(json.records);
                }
              } catch {}
            }} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg">Import</button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
        <h2 className="font-medium text-lg mb-4">Reminders</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">Daily reminder</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get a notification to journal</p>
          </div>
          <button onClick={async () => {
            if (setReminderEnabled) {
              if (!reminderEnabled && 'Notification' in window && Notification.permission !== 'granted') {
                try { await Notification.requestPermission(); } catch {}
              }
              setReminderEnabled(!reminderEnabled);
            }
          }} className={`flex items-center px-3 py-2 rounded-lg w-24 justify-center ${reminderEnabled ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}>{reminderEnabled ? 'On' : 'Off'}</button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">Reminder time</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select when to be reminded</p>
          </div>
          <input type="time" value={reminderTime} onChange={(e) => setReminderTime && setReminderTime(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-900 dark:text-gray-100" />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-medium text-lg mb-2">About</h2>
        <p className="text-gray-600 dark:text-gray-300">Life Tracker v1.0</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your daily activities and get insights about your habits.
        </p>
      </div>
    </div>;
}