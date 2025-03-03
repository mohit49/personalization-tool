"use client";
import { AppProvider } from "@/app/context/provider";

export default function App({ children }) {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
}
