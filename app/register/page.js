'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
import LoginImg from "@/public/images/login.png";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from '@/include/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerUser } from '@/app/api/api'; // Import the reusable API function

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(true); // To control the card visibility
  const [showMessage, setShowMessage] = useState(false); // To control the success message visibility
  let socket;

  useEffect(() => {
    socket = io({
      path: '/api/socket',
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input);
      setInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simple validation
    if (!username || !email || !phone || !name || !password) {
      setError('All fields are required');
      return;
    }

    setError(''); 
    setLoading(true);

    // Prepare user data
    const userData = {
      username,
      email,
      phone,
      name,
      password,
    };

    // Make API request to register the user
    try {
      const response = await registerUser(userData); // Using the reusable API function
      console.log('Registration successful', response);
      
      // Trigger fade-out animation and show success message
      setShowCard(false);
      setTimeout(() => {
        setShowMessage(true);
      }, 1000); // Show message after the fade-out animation completes
      
    } catch (err) {
      // Handle error
      setError(err.message || 'Registration failed. Please try again later.');
      console.error('Error registering user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='w-full h-[100vh] flex flex-col bg-[#6a45f9]'>
      <Header />
      
      {/* Conditionally render the registration card */}
      {showCard && (
        <Card className={`w-[600px] mx-auto mt-[6%] ${!showCard && 'fade-out'}`}>
          <CardHeader>
            <CardTitle className="text-[25px]">Register To Your Account Now</CardTitle>
            <CardDescription>Personalize Your Website With Prezify</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex w-full flex-row items-center gap-4">
                <div className="flex flex-col w-[50%] space-y-1.5">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    className="h-[45px]"
                    placeholder="Enter Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-[50%] space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="h-[45px]"
                    id="email"
                    placeholder="Enter Your Email Here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center gap-4 mt-4">
                <div className="flex flex-col w-[50%] space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    className="h-[45px]"
                    placeholder="Enter Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-[50%] space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    className="h-[45px]"
                    id="name"
                    placeholder="Enter Your Full Name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row items-center gap-4 mt-4">
                <div className="flex flex-col w-[50%] space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    className="h-[45px]"
                    placeholder="Enter Your Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-[50%] space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    className="h-[45px]"
                    id="confirm-password"
                    placeholder="Confirm Your Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <div className='flex flex-row item-end w-full justify-between'>
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Registering...' : 'Register Now'}
              </Button>
              <p className='mt-[5px] text-[14px]'>
                Already Have an Account? <Link href="/login" className='text-[#6a45f9]'>Login Now</Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Show the success message after registration */}
      {showMessage && (
        <div className="fade-in text-center mt-4 min-h-[500px] flex flex-col items-center justify-center">
          <h2 className="text-5xl font-semibold text-white">WOW :) Successfully Registered!</h2>
          <br/>
          <p className="text-lg text-white w-[600px]">Now, please check your email to verify your account. Make Sure the verification token will be expired in an hour, you can still login using your email id password but you still need to verify you email</p>
        </div>
      )}
    </section>
  );
}
