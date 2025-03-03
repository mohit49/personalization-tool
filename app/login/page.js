'use client';

import { useState , useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from '@/include/header';
import { AppContext } from "@/app/context/provider"; // Import AppContext
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {useLogin} from '@/app/api/api'; // Import the useLogin hook
import { useRouter } from "next/navigation"; // Correct import for App Router
export default function Home() {
   const { user, isLoggedIn, setIsLoggedIn, setUser } = useContext(AppContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin(); // Use the useLogin hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = await login(email, password);

    if (userData) {
      if(userData.message == "Login successful") {
        setIsLoggedIn(true)
        router.push(`/dashboard/`);
      }
    }
  };

  return (
    <section className='w-full h-[100vh] flex flex-col bg-[#6a45f9]'>
      <Header />
      <Card className="w-[400px] mx-auto mt-[5%] opacity-0 animate-fadeIn">
        <CardHeader>
          <CardTitle className="text-[30px]">Login to Your Projects</CardTitle>
          <CardDescription>Personalize Your Website With Prezify</CardDescription>
        </CardHeader>
        <CardContent>
          <form >
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-[45px]"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-[45px]"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className='flex flex-row w-full justify-between'>
            <Button onClick={handleSubmit} disabled={isLoading} type="submit">{isLoading ? 'Logging In...' : 'Login Now'}</Button>
            <p className='mt-[5px] text-[12px]'>
              Forgot Password?{' '}
              <Link href="#" className='text-[#6a45f9]'>Reset Now</Link>
            </p>
          </div>
          <p className='w-full text-center relative pt-10'>
            <span className='w-full h-[1px] bg-[#cccccc] absolute left-0 top-[50%]'></span>
          </p>
          <p className='mt-[5px] text-[14px]'>
            Not a Member Yet?{' '}
            <Link href="/register" className='text-[#6a45f9]'>Register Now</Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
