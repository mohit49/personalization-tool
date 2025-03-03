"use client";
import { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "@/app/api/api";
import { useRouter } from "next/navigation"; // Correct import for App Router
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function getUserData() {
      const userData = await fetchUserProfile();
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      }
      else {
        setIsLoggedIn(false);
        router.push(`/login/`);
      }
    }
    getUserData();
  }, [isLoggedIn]);

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, isLoggedIn, setIsLoggedIn , projects, setProjects }}>
      {children}
    </AppContext.Provider>
  );
}
