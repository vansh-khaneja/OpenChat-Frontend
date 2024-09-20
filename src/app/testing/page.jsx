'use client'

import React, { useState, useRef, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation';  // Import the useRouter hook for navigation
import axios from 'axios'
import { Send, Loader2, MessageSquare, Settings, HelpCircle, Key, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import firebase_app from '@/components/firebase-config'


const defaultApiKey = '16e22a5351e10611'

const LoadingDots = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
  </div>
)

const FullPageChatbotWithApiKey = () => {
  const router = useRouter();  // Initialize router for navigation
  const auth = getAuth(firebase_app);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isChatStarted, setIsChatStarted] = useState(false);
  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // If the user is not logged in, redirect to /auth
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setIsChatStarted(true);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), content: input, isUser: true };
    const loadingMessage = { id: Date.now() + 1, content: '', isUser: false, isLoading: true };
    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare the full chat history to be sent
      const chatHistory = messages.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Add the current user input to the history
      chatHistory.push({ role: 'user', content: input });

      // Send both the API key and the chat history
      const response = await axios.post('http://127.0.0.1:5000/query', {
        query: input,
        chat_history: chatHistory,
        api_key: apiKey || defaultApiKey,
        user_id: user.uid, // Access user UID
      });

      // Update the message list, replacing the loading message with the response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response.data.response, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isChatStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-white to-rose-50">
        <div className="w-[500px] bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-100 to-rose-100 p-6 rounded-t-lg">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
              Welcome to Playgroud
            </h2>
            <p className="text-gray-600 text-lg">Enter your API key to start chatting</p>
          </div>
          <div className="p-6">
            <form onSubmit={startChat}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white p-3 rounded-md hover:from-indigo-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
          <div className="bg-gray-50 p-4 text-center rounded-b-lg">
            <p className="text-sm text-gray-600">Don't have an API key? A default key will be used.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-indigo-50 via-white to-rose-50 pt-14">
      {/* Sidebar code remains unchanged */}
      <div className="flex flex-col flex-1 md:pl-64">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-6 sm:px-6 md:px-8">
              <div className="bg-white shadow-lg rounded-lg flex flex-col h-[calc(90vh-2rem)] border border-gray-200">
                <div className="px-4 py-3 border-b bg-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
                    Chat with AI
                  </h2>
                </div>
                <div className="flex-1 p-2 overflow-y-auto" ref={scrollAreaRef}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start mb-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isUser && (
                        <Bot className="w-8 h-8 rounded-full bg-indigo-100 p-1 mr-2 flex-shrink-0" />
                      )}
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          message.isUser ? 'bg-indigo-100 text-gray-800' : 'bg-gray-200 text-gray-800'
                        } max-w-[70%]`}
                      >
                        {message.isLoading ? <LoadingDots /> : message.content}
                      </div>
                      {message.isUser && (
                        <User className="w-8 h-8 rounded-full bg-rose-100 p-1 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-t p-2 bg-gray-50">
                  <form onSubmit={sendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FullPageChatbotWithApiKey;
