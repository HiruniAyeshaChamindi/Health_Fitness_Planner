import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { chatbotAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Lightbulb,
  Heart,
  Dumbbell,
  Utensils,
  Target,
  Clock,
  Sparkles,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    {
      icon: Utensils,
      text: "What should I eat for breakfast?",
      color: "blue"
    },
    {
      icon: Dumbbell,
      text: "Suggest a quick workout",
      color: "green"
    },
    {
      icon: Target,
      text: "How to stay motivated?",
      color: "purple"
    },
    {
      icon: Heart,
      text: "Tips for better sleep",
      color: "red"
    }
  ];

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: '1',
      type: 'bot',
      content: `Hello ${user?.name || 'there'}! 👋 I'm your AI fitness companion. I'm here to help you with nutrition advice, workout suggestions, motivation tips, and answer any health-related questions you might have. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      suggestions: quickQuestions.map(q => q.text)
    };
    
    if (validateMessage(welcomeMessage)) {
      setMessages([welcomeMessage]);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText || '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await chatbotAPI.sendMessage(messageText);
      
      // Simulate typing delay
      setTimeout(() => {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
<<<<<<< Updated upstream
          content: response.data.response,
=======
          content: response.data.message || response.data.response || "I received your message but couldn't generate a proper response.",
          content: response.data.message || response.data.response || 'No response received',
>>>>>>> Stashed changes
          timestamp: new Date().toISOString(),
          suggestions: response.data.suggestions || []
        };

        if (validateMessage(botMessage)) {
          setMessages(prev => [...prev, botMessage]);
        } else {
          console.error('Invalid bot message:', botMessage);
        }
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      if (validateMessage(errorMessage)) {
        setMessages(prev => [...prev, errorMessage]);
      }
      toast.error('Failed to get response from AI assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text) => {
    if (!text || typeof text !== 'string') {
      toast.error('No content to copy');
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success('Message copied to clipboard!');
  };

  const validateMessage = (message) => {
    return message && 
           typeof message === 'object' && 
           message.id && 
           message.type && 
           typeof message.content === 'string';
  };

  const formatMessage = (content) => {
<<<<<<< Updated upstream
=======
    // Check if content is defined and is a string
    if (!content || typeof content !== 'string') {
      return 'Message content is not available.';
    }
    
    // Handle undefined or null content
    if (!content || typeof content !== 'string') {
      return '';
    }
    
>>>>>>> Stashed changes
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bot className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Fitness Assistant</h1>
                <p className="text-gray-600">Get personalized advice and support 24/7</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Online
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.filter(validateMessage).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-6 w-6" />
                  ) : (
                    <Bot className="h-6 w-6" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-3xl ${
                  message.type === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : message.isError
                      ? 'bg-red-100 border border-red-200 text-red-800'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.content) 
                      }}
                      className="text-sm leading-relaxed"
                    />
                    
                    {/* Message Actions */}
                    {message.type === 'bot' && !message.isError && (
                      <div className="flex items-center justify-end mt-3 space-x-2">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy message"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Helpful"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Not helpful"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs text-gray-500 mt-1 ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Quick actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickQuestion(suggestion)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white border-t border-gray-200"
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-600 font-medium mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Try asking about:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => {
                  const Icon = question.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question.text)}
                      className={`flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-${question.color}-300 hover:bg-${question.color}-50 transition-colors group`}
                    >
                      <div className={`p-2 bg-${question.color}-100 rounded-lg mr-3 group-hover:bg-${question.color}-200 transition-colors`}>
                        <Icon className={`h-5 w-5 text-${question.color}-600`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {question.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fitness, nutrition, or wellness..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  {inputMessage.trim() && (
                    <span className="text-xs text-gray-400">
                      Press Enter to send
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI responses are for informational purposes only. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
