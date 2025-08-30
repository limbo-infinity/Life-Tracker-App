import React, { useEffect, useState, useRef } from 'react';
import { MessageSquareIcon, SendIcon } from 'lucide-react';
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};
// Add this interface for props to access user records
interface ChatbotPageProps {
  records?: Array<{
    id: number;
    text: string;
    timestamp: string;
    date: string;
  }>;
}
export function ChatbotPage({
  records = []
}: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm your AI assistant. How can I help you with tracking your activities today?",
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  // Function to call OpenAI API directly from the browser
  const callAIApi = async (prompt: string): Promise<string> => {
    try {
      // Check if OpenAI API key is configured
      const apiKey = localStorage.getItem('aiApiKey');
      const aiEnabled = localStorage.getItem('aiEnabled') === 'true';
      
      if (!apiKey || !aiEnabled) {
        // Fall back to intelligent mock responses
        return generateMockResponse(prompt);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: 'You are an AI assistant that helps users track their activities and habits. You have access to their activity records and can provide personalized insights, suggestions, and motivation. Keep responses concise, helpful, and encouraging. Focus on helping them build better habits and understand their patterns.' 
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { 
              role: 'user', 
              content: `User's recent activities: ${records.slice(0, 10).map(r => r.text).join(', ')}. User question: ${prompt}` 
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response from AI.';
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error);
      // Fall back to intelligent mock responses
      return generateMockResponse(prompt);
    }
  };
  // Generate intelligent responses based on user input and records
  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Check if the query is about records or activities
    if (input.includes('record') || input.includes('activity') || input.includes('what did i do') || input.includes('my day')) {
      if (records && records.length > 0) {
        const recentRecords = records.slice(0, 5);
        const recordsList = recentRecords.map(r => r.text).join(', ');
        
        // Analyze activity patterns
        const activities = records.map(r => r.text.toLowerCase());
        const patterns = [];
        
        if (activities.filter(a => a.includes('walk') || a.includes('exercise') || a.includes('workout')).length > 1) {
          patterns.push('You tend to be physically active');
        }
        if (activities.filter(a => a.includes('read') || a.includes('book') || a.includes('study')).length > 1) {
          patterns.push('You prioritize learning');
        }
        if (activities.filter(a => a.includes('meditat') || a.includes('mindful')).length > 0) {
          patterns.push('You practice mindfulness');
        }
        
        let response = `Based on your records, your recent activities include: ${recordsList}. `;
        if (patterns.length > 0) {
          response += `I've noticed some patterns: ${patterns.join(', ')}. `;
        }
        response += 'Would you like me to analyze specific aspects or suggest improvements?';
        return response;
      } else {
        return "I don't see any recorded activities yet. Start by adding some activities to your tracker, and I'll be able to provide insights and suggestions!";
      }
    }
    
    // Check for different types of queries
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! I\'m your AI assistant, ready to help you track and analyze your activities. How can I assist you today?';
    } 
    
    if (input.includes('help') || input.includes('what can you do')) {
      return 'I can help you analyze your activities, identify patterns in your habits, suggest improvements, answer questions about your records, and provide personalized insights. What would you like to explore?';
    } 
    
    if (input.includes('habit') || input.includes('routine') || input.includes('pattern')) {
      if (records && records.length > 2) {
        return 'Great question! Based on your records, I can see you\'re building good habits. To strengthen them, try scheduling activities at consistent times and tracking your progress. What area would you like to focus on?';
      } else {
        return 'I\'m still learning about your habits. As you add more activities, I\'ll be able to identify patterns and suggest ways to build stronger routines. Keep tracking your daily activities!';
      }
    } 
    
    if (input.includes('progress') || input.includes('improvement') || input.includes('how am i doing')) {
      if (records && records.length > 0) {
        return `You're making good progress! With ${records.length} total activities recorded, you're building a solid foundation. To improve further, consider setting specific goals and tracking your consistency. What area would you like to focus on?`;
      } else {
        return 'You\'re just getting started! The first step is to begin recording your activities. Once you have some data, I can help you track progress and suggest improvements.';
      }
    } 
    
    if (input.includes('suggest') || input.includes('recommendation') || input.includes('idea')) {
      if (records && records.length > 0) {
        return 'Based on your current activities, I\'d recommend adding more variety - perhaps some physical activity, learning pursuits, or mindfulness practices. These additions could help create a more balanced lifestyle. What interests you most?';
      } else {
        return 'Since you\'re just starting, I recommend beginning with simple activities like "morning walk", "read for 15 minutes", or "meditate for 5 minutes". Start small and build from there!';
      }
    } 
    
    if (input.includes('thank')) {
      return "You're welcome! I'm here to help you track your progress and build better habits. Feel free to ask me anything about your activities or how to improve your routine.";
    } 
    
    if (input.includes('goal') || input.includes('target')) {
      return 'Setting goals is a great way to stay motivated! Consider setting SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). For example, "Read 3 books this month" or "Exercise 4 times per week". What type of goal interests you?';
    }
    
    if (input.includes('motivation') || input.includes('inspire')) {
      return 'Remember, every great journey starts with a single step. You\'re already taking action by tracking your activities, which puts you ahead of most people. Focus on progress, not perfection. What small step can you take today?';
    }
    
    // Default response for unrecognized queries
    return "That's an interesting question! I'd be happy to help you analyze your activity patterns, suggest habit improvements, or discuss your goals. What would you like to focus on?";
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    try {
      // Call AI API for response
      const aiResponseText = await callAIApi(inputText);
      // Add AI response to messages
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      }]);
    } catch (error) {
      // Handle error
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      }]);
      console.error('Error in chat:', error);
    } finally {
      setIsTyping(false);
    }
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <MessageSquareIcon size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
          <p className="text-xs text-gray-500">Always here to help</p>
        </div>
        <div className="ml-auto flex items-center text-xs text-gray-500">
          <button onClick={() => {
            const current = localStorage.getItem('openai_api_key') || '';
            const value = window.prompt('Enter OpenAI API key', current || '');
            if (value !== null) {
              if (value.trim()) localStorage.setItem('openai_api_key', value.trim());
              else localStorage.removeItem('openai_api_key');
            }
          }} className="underline">Set API key</button>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {messages.map(message => <div key={message.id} className={`mb-4 max-w-[85%] ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
              {message.text}
            </div>
            <div className={`text-xs mt-1 text-gray-500 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              {formatTime(message.timestamp)}
            </div>
          </div>)}
        {isTyping && <div className="flex items-center mb-4 max-w-[85%]">
            <div className="bg-gray-200 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{
              animationDelay: '0ms'
            }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{
              animationDelay: '150ms'
            }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{
              animationDelay: '300ms'
            }}></div>
              </div>
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type a message..." className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100" disabled={isTyping} />
        <button type="submit" className={`ml-2 p-3 rounded-lg ${inputText.trim() && !isTyping ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} dark:${inputText.trim() && !isTyping ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`} disabled={!inputText.trim() || isTyping}>
          <SendIcon size={20} />
        </button>
      </form>
    </div>;
}