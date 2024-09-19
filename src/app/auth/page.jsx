'use client'

import { useState, useEffect,useContext } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import firebase_app from '@/components/firebase-config';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AuthComponent() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [user, setUser] = useState(null);
  const [showUserId, setShowUserId] = useState(false);
  const router = useRouter();
  const auth = getAuth(firebase_app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setShowUserId(true);
        setTimeout(() => {
          router.push('/');
        }, 3000); // Redirect after 3 seconds
      } else {
        setUser(null);
        setShowUserId(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (showUserId && user) {
    console.log(user.uid)
    

    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 via-rose-100 to-indigo-50 pt-16">
      <Card className="w-[450px] bg-white shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-rose-100 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-800">Welcome to OpenChat</CardTitle>
          <CardDescription className="text-gray-600">Sign in or create an account to get started</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger 
                value="signin"
                className="data-[state=active]:bg-gradient-to-r from-indigo-500 to-rose-500 data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-gradient-to-r from-indigo-500 to-rose-500 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1">
                    <Input
                      id="email"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600 transition-all" type="submit">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="displayName"
                      placeholder="Display Name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="email"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-indigo-200 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600 transition-all" type="submit">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Button variant="outline" onClick={handleGoogleSignIn} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}