import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatbotQuery, getChatbotHistory } from '../lib/api';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Code,
  Shield,
  Zap,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const BaselineChatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      type: 'bot',
      content: `👋 Hi! I'm your Google Baseline assistant. I can help you with:

• **Google Baseline 2024/2025** features and implementation
• **Performance optimization** and Core Web Vitals
• **Security best practices** and HTTPS setup
• **Accessibility** and WCAG compliance
• **SEO optimization** techniques

What would you like to know about?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        "What is Google Baseline 2024?",
        "How do I improve Core Web Vitals?",
        "What security headers should I use?",
        "How do I make my site accessible?"
      ]
    }]);

    // Load chat history if user is logged in
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatbotHistory(user!.id);
      if (history.conversations && history.conversations.length > 0) {
        const historyMessages = history.conversations.reverse().map((conv: any) => ([
          {
            id: `user-${conv.id}`,
            type: 'user' as const,
            content: conv.message,
            timestamp: conv.created_at
          },
          {
            id: `bot-${conv.id}`,
            type: 'bot' as const,
            content: conv.response,
            timestamp: conv.created_at
          }
        ])).flat();

        setMessages(prev => [...prev, ...historyMessages]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotQuery({
        query: input.trim(),
        context,
        userId: user?.id
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.response,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setContext(response.context);

    } catch (error) {
      toast.error('Failed to get response');
      console.error('Chatbot error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const quickActions = [
    { icon: Code, label: "Baseline Features", query: "What are Google Baseline 2024 features?" },
    { icon: Zap, label: "Performance", query: "How do I improve Core Web Vitals?" },
    { icon: Shield, label: "Security", query: "What security headers should I implement?" },
    { icon: Search, label: "SEO", query: "What are the best SEO practices?" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Baseline Assistant</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get expert guidance on Google Baseline standards, web performance, security, and accessibility
        </p>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(action.query)}
                className="p-4 text-center border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <action.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                }`}>
                  {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Suggested questions:</p>
                      <div className="space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block text-xs text-blue-600 hover:text-blue-800 text-left"
                          >
                            • {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about Google Baseline, performance, security, or accessibility..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Ask specific questions about Google Baseline features</li>
              <li>• Request implementation examples for better understanding</li>
              <li>• Ask about browser compatibility and support</li>
              <li>• Get recommendations for performance optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaselineChatbot;