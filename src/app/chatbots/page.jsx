'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Download, Palette } from "lucide-react"
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const CodeBlock = ({ code, language }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
  }, [code]);

  return (
    <pre>
      <code ref={codeRef} className={language}>
        {code}
      </code>
    </pre>
  );
};

export default function ChatbotImplementationGuide() {
  const [apiKey, setApiKey] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [buttonColor, setButtonColor] = useState('#000000')
  const [headerColor, setHeaderColor] = useState('#4F46E5')
  const [sendButtonColor, setSendButtonColor] = useState('#3B82F6')
  const [userResponseColor, setUserResponseColor] = useState('#3B82F6')
  const [botResponseColor, setBotResponseColor] = useState('#E5E7EB')
  const [tempButtonColor, setTempButtonColor] = useState('#000000')
  const [tempHeaderColor, setTempHeaderColor] = useState('#4F46E5')
  const [tempSendButtonColor, setTempSendButtonColor] = useState('#3B82F6')
  const [tempUserResponseColor, setTempUserResponseColor] = useState('#3B82F6')
  const [tempBotResponseColor, setTempBotResponseColor] = useState('#E5E7EB')

  const handleColorSubmit = (e) => {
    e.preventDefault()
    setButtonColor(tempButtonColor)
    setHeaderColor(tempHeaderColor)
    setSendButtonColor(tempSendButtonColor)
    setUserResponseColor(tempUserResponseColor)
    setBotResponseColor(tempBotResponseColor)
    setIsColorDialogOpen(false)
  }

  const handleDownload = () => {
    if (apiKey) {
      const content = `'use client'
  
      import React, { useState, useRef, useEffect } from 'react'
      import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react'
      import axios from 'axios'
      import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
      import firebase_app from '@/components/firebase-config'
      
      import { useRouter } from 'next/navigation';  // Import the useRouter hook for navigation
      
      export default function FloatingChatbot({ apiKey = "5b8b563c5d62dffe" }) {
        const router = useRouter();  // Initialize router for navigation
      
        const [isOpen, setIsOpen] = useState(false)
        const [input, setInput] = useState('')
        const auth = getAuth(firebase_app);
        const [user, setUser] = useState(null);
        const [messages, setMessages] = useState([])
        const [isLoading, setIsLoading] = useState(false)
        const scrollAreaRef = useRef(null)
      
        const scrollToBottom = () => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
          }
        }
        
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
          scrollToBottom()
        }, [messages])
      
        const sendMessage = async (e) => {
          e.preventDefault()
          if (!input.trim()) return
      
          const userMessage = { id: Date.now(), content: input, isUser: true }
          const loadingMessage = { id: Date.now() + 1, content: '', isUser: false, isLoading: true }
          setMessages((prev) => [...prev, userMessage, loadingMessage])
          setInput('')
          setIsLoading(true)
      
          try {
            const chatHistory = messages.map((msg) => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content,
            }))
      
            chatHistory.push({ role: 'user', content: input })
      
            const response = await axios.post('https://open-chat-backend-deploy-production.up.railway.app/query', {
              query: input,
              chat_history: chatHistory,
              api_key: apiKey,
              user_id: user.uid,
            })
      
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === loadingMessage.id
                  ? { ...msg, content: response.data.response, isLoading: false }
                  : msg
              )
            )
          } catch (error) {
            console.error('Error sending message:', error)
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === loadingMessage.id
                  ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isLoading: false }
                  : msg
              )
            )
          } finally {
            setIsLoading(false)
          }
        }
      
        return (
          <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
              <button
                className="rounded-full w-12 h-12 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                style={{ backgroundColor: '${buttonColor}' }}
                onClick={() => setIsOpen(true)}
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            )}
            {isOpen && (
              <div className="w-80 bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-black p-4 flex justify-between items-center" style={{ backgroundColor: '${headerColor}' }}>
                  <h3 className="text-lg font-semibold text-white">Chat with AI</h3>
                  <button
                    className="text-white hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-[300px] overflow-y-auto p-4 bg-gray-50" ref={scrollAreaRef}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={\`flex items-start mb-4 \${
                        message.isUser ? 'justify-end' : 'justify-start'
                      }\`}
                    >
                      {!message.isUser && (
                        <Bot className="w-8 h-8 rounded-full bg-gray-200 p-1 mr-2 flex-shrink-0" />
                      )}
                      <div
                        className={\`p-3 rounded-lg max-w-[70%]\`}
                        style={{
                          backgroundColor: message.isUser ? '${userResponseColor}' : '${botResponseColor}',
                          color: '#000000'
                        }}
                      >
                        {message.isLoading ? (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      {message.isUser && (
                        <User className="w-8 h-8 rounded-full bg-blue-100 p-1 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="p-2 bg-black text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all duration-300"
                      style={{ backgroundColor: '${sendButtonColor}' }}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )
      }`;
      
      const contents = `import React from 'react';
      import FloatingChatbot from '@/components/FloatingChatbot';
      
      const HomePage = () => {
        return (
          <div className="min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold p-8">Welcome to Our Website</h1>
            <p className="px-8">How can we help you today?</p>
            <FloatingChatbot apiKey="YOUR_API_KEY" />
          </div>
        );
      };
      
      export default HomePage;`
      

      const blob = new Blob([content], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'FloatingChatbot.jsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsDialogOpen(false)
    }
  }

  const code = `'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react'
import axios from 'axios'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import firebase_app from '@/components/firebase-config'

import { useRouter } from 'next/navigation';  // Import the useRouter hook for navigation

export default function FloatingChatbot({ apiKey = "5b8b563c5d62dffe" }) {
  const router = useRouter();  // Initialize router for navigation

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const auth = getAuth(firebase_app);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }
  
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
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now(), content: input, isUser: true }
    const loadingMessage = { id: Date.now() + 1, content: '', isUser: false, isLoading: true }
    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setInput('')
    setIsLoading(true)

    try {
      const chatHistory = messages.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }))

      chatHistory.push({ role: 'user', content: input })

      const response = await axios.post('https://open-chat-backend-deploy-production.up.railway.app/query', {
        query: input,
        chat_history: chatHistory,
        api_key: apiKey,
        user_id: user.uid,
      })

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: response.data.response, isLoading: false }
            : msg
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isLoading: false }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          className="rounded-full w-12 h-12 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          style={{ backgroundColor: '${buttonColor}' }}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <div className="w-80 bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-black p-4 flex justify-between items-center" style={{ backgroundColor: '${headerColor}' }}>
            <h3 className="text-lg font-semibold text-white">Chat with AI</h3>
            <button
              className="text-white hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] overflow-y-auto p-4 bg-gray-50" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={\`flex items-start mb-4 \${
                  message.isUser ? 'justify-end' : 'justify-start'
                }\`}
              >
                {!message.isUser && (
                  <Bot className="w-8 h-8 rounded-full bg-gray-200 p-1 mr-2 flex-shrink-0" />
                )}
                <div
                  className={\`p-3 rounded-lg max-w-[70%]\${
                    message.isUser
                      ? '${userResponseColor} text-gray-800'
                      : '${botResponseColor} text-gray-800'
                  }\`}
                >
                  {message.isLoading ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
                {message.isUser && (
                  <User className="w-8 h-8 rounded-full bg-blue-100 p-1 ml-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-black text-white rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-all duration-300"
                style={{ backgroundColor: '${sendButtonColor}' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}`;

const contents = `import React from 'react';
import FloatingChatbot from '@/components/FloatingChatbot';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold p-8">Welcome to Our Website</h1>
      <p className="px-8">How can we help you today?</p>
      <FloatingChatbot apiKey="YOUR_API_KEY" />
    </div>
  );
};

export default HomePage;`


  return (
    <div className="container mx-auto px-4 py-28 bg-gradient-to-r from-indigo-50 to-rose-50">
      <div className="flex items-center space-x-4 mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-md hover:from-indigo-600 hover:to-rose-600 transition-all">
              <Download className="mr-2 h-4 w-4" /> Download FloatingChatbot.jsx
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Enter API Key</DialogTitle>
              <DialogDescription>
                Please enter your API key to download the FloatingChatbot.jsx file.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="api-key" className="text-right">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDownload} disabled={!apiKey}>Download</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-rose-600 text-white hover:from-indigo-500 hover:to-rose-500 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <Palette className="mr-2 h-4 w-4" /> Customize Colors
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-3xl">Customize Colors</DialogTitle>
              <DialogDescription className="text-lg">
                Choose custom colors for the chatbot components.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleColorSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="button-color" className="text-right">
                    ChatBot appearance Color
                  </Label>
                  <Input
                    id="button-color"
                    type="color"
                    value={tempButtonColor}
                    onChange={(e) => setTempButtonColor(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="header-color" className="text-right">
                    Header Color
                  </Label>
                  <Input
                    id="header-color"
                    type="color"
                    value={tempHeaderColor}
                    onChange={(e) => setTempHeaderColor(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="send-button-color" className="text-right">
                    Submit Button Color
                  </Label>
                  <Input
                    id="send-button-color"
                    type="color"
                    value={tempSendButtonColor}
                    onChange={(e) => setTempSendButtonColor(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="user-response-color" className="text-right">
                    User Response Color
                  </Label>
                  <Input
                    id="user-response-color"
                    type="color"
                    value={tempUserResponseColor}
                    onChange={(e) => setTempUserResponseColor(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bot-response-color" className="text-right">
                    Bot Response Color
                  </Label>
                  <Input
                    id="bot-response-color"
                    type="color"
                    value={tempBotResponseColor}
                    onChange={(e) => setTempBotResponseColor(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg text-xl">Apply Colors</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-gray-800">Implementing a Chatbot on Your Website</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Introduction</h2>
        <p className="mb-4 text-gray-600">
          Implementing a chatbot on your website can greatly enhance user experience and provide instant support to your visitors. This guide will walk you through the process of adding a floating chatbot to your website using React and a custom chatbot API.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Floating Chatbot Component</h2>
        <p className="mb-4 text-gray-600">
          The FloatingChatbot component creates a chat interface that can be easily integrated into any React application. It includes features such as a collapsible chat window, message history, and API integration.
        </p>
        <Card className="shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-100 to-rose-100 p-4 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-800">FloatingChatbot.jsx</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <CodeBlock code={code} language="javascript" />
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Implementing the Chatbot</h2>
        <p className="mb-4 text-gray-600">
          To implement the floating chatbot on your website, follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Click the "Customize Colors" button to open the color customization dialog.</li>
          <li>Choose your desired colors for the button, header, send button, user response, and bot response.</li>
          <li>Click "Apply Colors" to set your chosen colors.</li>
          <li>Click the "Download FloatingChatbot.jsx" button and enter your API key.</li>
          <li>Save the downloaded file as <code className="bg-gray-200 px-1 rounded">FloatingChatbot.jsx</code> in your components folder.</li>
          <li>Import and use the FloatingChatbot component in your desired page or layout file.</li>
          <li>Ensure you have the required dependencies installed (react and lucide-react).</li>
          <li>Customize the styling and behavior as needed.</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Example Usage</h2>
        <p className="mb-4 text-gray-600">
          Here's an example of how to use the FloatingChatbot component in a page:
        </p>
        <Card className="shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-100 to-rose-100 p-4 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-gray-800">page.js</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <CodeBlock code={contents} language="javascript" />
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Additional Considerations</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Ensure your chatbot API is secure and can handle the expected traffic.</li>
          <li>Implement error handling for API failures or timeouts.</li>
          <li>Consider adding features like typing indicators or message timestamps.</li>
          <li>Test thoroughly across different devices and browsers.</li>
          <li>Customize the chat interface to match your website's design.</li>
        </ul>
      </section>

      <footer className="text-center text-sm text-gray-600 mt-12 border-t border-gray-200 pt-4">
        <p>Created with ❤️ by the OpenChat Team</p>
      </footer>
    </div>
  )
}