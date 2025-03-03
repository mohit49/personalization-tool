"use client";
import { Terminal } from "lucide-react"
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AppContext } from "@/app/context/provider"; // Import AppContext
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isLoggedIn, setIsLoggedIn, setUser } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  let socket;

  useEffect(() => {
    socket = io({
      path: "/api/socket",
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <>
    <header className="w-full h-[80px] bg-[#6a45f9] flex">
      <div className="flex flex-row justify-between items-center w-full px-[0px] container">
        <Link href="#" className="font-brand text-5xl text-white">
          Prezify
        </Link>
        
        <nav>
          
        <ul className="flex flex-row space-x-4 text-[18px]">
        {isLoggedIn ? (
              <>
              <li><Link href="/dashboard" className="text-white">Dashboard</Link></li>
                <li>
                <DropdownMenu>
  <DropdownMenuTrigger> <span className="text-white">Hello! {user?.username}</span></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem  onClick={handleLogout}> 
                  
                    Logout
                 </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

                 
                </li>
             
              </>
            ) : (
            <>
            <li>
              <Link className="text-white" href="/">
                About
              </Link>
            </li>
            <li>
              <Link className="text-white" href="/">
                Contact
              </Link>
            </li>
            <li>
              <Link className="text-white" href="/">
                Blogs
              </Link>
            </li>
          
         
        </>
            )}
            </ul>
            </nav>
      </div>

    </header>
   
   {isLoggedIn && (!user?.emailVerified && !user?.emailVerified) &&
   
   <Alert variant="destructive">
     <div className="px-[20px] container">
    <Terminal className="h-4 w-4" />
   
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription className="flex flex-row items-center justify-between">
      <p>
     Your Email and Phone Number are still not verified. Please verify your email to access all features.
     </p>
     <Button className="">Verify Now</Button>
     
    </AlertDescription>
    </div>
   
  </Alert>}
  </>
  );
}
