'use client';


import { useState , useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from '@/include/header';
import { AppContext } from "@/app/context/provider"; // Import AppContext
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {useLogin} from '@/app/api/api'; // Import the useLogin hook
import { useParams, useRouter } from "next/navigation"; // Correct import for App Router

import axios from 'axios';


const ResetPassword = () => {
  const { token } = useParams();  // Extract the reset token from the URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setLoading] = useState('');
  const router = useRouter();
  // Check if the token exists
  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid reset token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      // Make the API call to reset the password
      const response = await axios.post(
        `https://app.mazzl.ae/api/auth/reset-password-page`,  // Backend API endpoint for password reset
        { token, newPassword }
      );

      setSuccessMessage("Password reset successfully! You will be redirected to the homepage.");
      setTimeout(() => {
        router.push('/login');  // Redirect user to login page after successful password reset
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (

<section className='w-full h-[100vh] flex flex-col bg-[#6a45f9]'>
<Header/>

<Card className="w-[400px] mx-auto mt-[5%] opacity-0 animate-fadeIn">
<CardHeader>
  <CardTitle className="text-[30px]">Reset Password</CardTitle>
  <CardDescription>Create your new password below</CardDescription>
</CardHeader>
<CardContent>
  <form onSubmit={handleSubmit} >
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label  htmlFor="newPassword">New Password</Label>
        <Input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
      </div>
    </div>
 
  </form>
  {errorMessage && <p className="error mt-3 text-red-500">{errorMessage}</p>}
      {successMessage && <p className="success mt-3 text-green-500">{successMessage}</p>}
</CardContent>
<CardFooter className="flex flex-col items-start">
  <div className='flex flex-row w-full justify-between'>
    <Button onClick={handleSubmit} disabled={isLoading} type="submit">{isLoading ? 'Logging In...' : 'Login Now'}</Button>
    <p className='mt-[5px] text-[12px]'>
      Request Reset Link Again ?
      <Link href="/reset-password" className='text-[#6a45f9]'>Request</Link>
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
};

export default ResetPassword;
