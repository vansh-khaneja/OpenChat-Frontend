'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import firebase_app from '@/components/firebase-config'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const auth = getAuth(firebase_app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [auth])
  const navigateToLogin = () => {
    // Navigate to the login page
    router.push('/auth');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-100 via-rose-100 to-indigo-50 shadow-lg fixed w-full top-0 left-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
                OpenChat
              </span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <NavLink href="/builder">Pipeline Builder</NavLink>
            <NavLink href="/testing">Playground</NavLink>
            <NavLink href="/chatbots">Integration</NavLink>
            <NavLink href="/documentation">Docs</NavLink>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer ">
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback className='bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg hover:from-indigo-600 hover:to-rose-600 transition-all'>{user.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => router.push('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/insights')}>Insights</DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleSignOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg hover:from-indigo-600 hover:to-rose-600 transition-all font-bold text-base" onClick={navigateToLogin}>
  Login/Signup
</Button>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" onClick={toggleMenu} className="text-indigo-700 hover:text-indigo-900">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gradient-to-r from-indigo-100 via-rose-100 to-indigo-50 border-t border-gray-200 shadow-lg">
          <div className="pt-2 pb-3 space-y-2">
            <MobileNavLink href="/builder" onClick={toggleMenu}>Pipeline Builder</MobileNavLink>
            <MobileNavLink href="/testing" onClick={toggleMenu}>Playground</MobileNavLink>
            <MobileNavLink href="/chatbots" onClick={toggleMenu}>Integration</MobileNavLink>
            <MobileNavLink href="/documentation" onClick={toggleMenu}>Docs</MobileNavLink>
            <div className="px-4 pt-2">
              {user ? (
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-md hover:from-indigo-600 hover:to-rose-600 transition-all" onClick={handleSignOut}>
                  Logout
                </Button>
              ) : (
                <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold text-2xl">
                  <NavLink href="/auth">Login/Signup</NavLink>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children }) {
  return (
    <Link 
      href={href} 
      className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }) {
  return (
    <Link 
      href={href} 
      className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-lg font-medium transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}