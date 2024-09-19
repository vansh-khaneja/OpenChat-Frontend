'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Copy } from "lucide-react"
import firebase_app from '@/components/firebase-config'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const auth = getAuth(firebase_app)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        // If no user is logged in, redirect to the login page
        router.push('/auth')
      }
      setLoading(false)
    })

    // Clean up the subscription
    return () => unsubscribe()
  }, [auth, router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey || 'sk-1234567890abcdef1234567890abcdef')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-rose-50 flex items-center justify-center px-4 mt-5">
      <Card className="w-full max-w-2xl bg-white shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-rose-100 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user.photoURL} />
              <AvatarFallback className='bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-5xl shadow-lg hover:from-indigo-600 hover:to-rose-600 transition-all'>
                {user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-gray-800">{user.displayName || "Anonymous"}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="text-lg font-medium text-gray-800">{user.uid}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">API Key</label>
              <div className="flex items-center mt-1">
                <input
                  type="password"
                  value="sk-1234567890abcdef1234567890abcdef"
                  readOnly
                  className="flex-grow text-lg font-medium text-gray-800 bg-gray-100 rounded-l-md p-2 focus:outline-none"
                />
                <Button
                  onClick={copyApiKey}
                  className="rounded-l-none bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                >
                  {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
          >
            <LogOut className="w-4 h-4 mr-2" /> Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
