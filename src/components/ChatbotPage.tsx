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
  // Function to call an AI API
  const callAIApi = async (prompt: string): Promise<string> => {
    // Replace this with your actual API call
    try {
      // For demonstration, we'll simulate an API call
      // In a real implementation, you would use fetch or axios to call your AI API
      // Example:
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${YOUR_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-3.5-turbo",
      //     messages: [
      //       { role: "system", content: "You are an AI assistant that helps users track their activities and habits." },
      //       ...messages.map(msg => ({
      //         role: msg.sender === 'user' ? 'user' : 'assistant',
      //         content: msg.text
      //       })),
      //       { role: "user", content: prompt }
      //     ]
      //   })
      // });
      // const data = await response.json();
      // return data.choices[0].message.content;
      // For now, we'll use our mock response function with a delay to simulate API latency
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(generateMockResponse(prompt));
        }, 1000);
      });
    } catch (error) {
      console.error('Error calling AI API:', error);
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  };
  // Generate mock responses based on user input and records
  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    // Check if the query is about records
    if (input.includes('record') || input.includes('activity') || input.includes('what did i do')) {
      // Use actual records data if available
      if (records && records.length > 0) {
        const recentRecords = records.slice(0, 3);
        const recordsList = recentRecords.map(r => r.text).join(', ');
        return `Based on your records, your recent activities include: ${recordsList}. Would you like more detailed insights about these activities?`;
      }
    }
    // Check for different types of queries
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! How can I help you today with tracking your activities?';
    } else if (input.includes('help') || input.includes('what can you do')) {
      return 'I can help you analyze your activities, suggest improvements to your habits, answer questions about your records, or just chat! What would you like to know?';
    } else if (input.includes('record') || input.includes('activity')) {
      return 'Your recent activities show a mix of physical activity, reading, and mindfulness. Would you like me to analyze a specific activity or suggest new ones based on your patterns?';
    } else if (input.includes('habit') || input.includes('routine')) {
      return 'Based on your records, I notice you have good habits around physical activity and reading. To build stronger routines, try scheduling these activities at consistent times each day.';
    } else if (input.includes('progress') || input.includes('improvement')) {
      return "You're making good progress with your activities! I've noticed consistent entries for reading and meditation. Would you like suggestions on how to improve further?";
    } else if (input.includes('suggest') || input.includes('recommendation')) {
      return 'Based on your current activities, you might enjoy adding a journaling practice to your routine. Just 5 minutes of reflection each evening can help consolidate your learning and growth.';
    } else if (input.includes('thank')) {
      return "You're welcome! I'm here anytime you need assistance with your activities and habits.";
    } else {
      return "That's an interesting point. Would you like me to analyze your activity patterns or suggest ways to build better habits based on your records?";
    }
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
  return <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <MessageSquareIcon size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
          <p className="text-xs text-gray-500">Always here to help</p>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
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
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center">
        <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type a message..." className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isTyping} />
        <button type="submit" className={`ml-2 p-3 rounded-lg ${inputText.trim() && !isTyping ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} disabled={!inputText.trim() || isTyping}>
          <SendIcon size={20} />
        </button>
      </form>
    </div>;
}