'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import axios from 'axios'; // Use axios for requests
import { useRouter } from 'next/navigation';  // Import the useRouter hook for navigation

const defaultApiKey = '71edd61aaa511f8b'; // Default API key
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import firebase_app from '@/components/firebase-config'

// Loading animation (from the static chatbot)
const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
);

export default function FloatingChatbot({ apiKey = defaultApiKey, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();  // Initialize router for navigation

  const [query, setQuery] = useState('');
  const auth = getAuth(firebase_app);
  const [user, setUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // If the user is not logged in, redirect to /auth
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever chat history updates
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const userMessage = { id: Date.now(), content: query, isUser: true };
    const loadingMessage = { id: Date.now() + 1, content: '', isUser: false, isLoading: true };

    setChatHistory((prev) => [...prev, userMessage, loadingMessage]);
    setQuery('');

    try {
      // Prepare the full chat history to be sent
      const chatHistoryFormatted = chatHistory.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Add the current user input to the history
      chatHistoryFormatted.push({ role: 'user', content: query });

      // Send both the API key and the chat history
      const response = await axios.post('https://open-chat-backend-deploy-production.up.railway.app/query', {
        query,
        chat_history: chatHistoryFormatted,
        api_key: apiKey,
        user_id: user.uid, // Assuming userId is passed as a prop
      });

      // Replace the loading message with the AI response
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response.data.response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error:', error);
      // Replace the loading message with an error message
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: 'An error occurred. Please try again.', isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          className="rounded-full w-12 h-12 bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <div className="w-80 bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-100 to-rose-100 p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Chat with AI</h3>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] overflow-y-auto p-4 bg-gray-50" ref={scrollAreaRef}>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && !message.isLoading && (
                  <Bot className="w-8 h-8 rounded-full bg-indigo-100 p-1 mr-2 flex-shrink-0" />
                )}
                <div
                  className={`p-3 rounded-lg max-w-[70%] ${
                    message.isUser
                      ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.isLoading ? <LoadingDots /> : message.content}
                </div>
                {message.isUser && (
                  <User className="w-8 h-8 rounded-full bg-rose-100 p-1 ml-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-md hover:from-indigo-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
