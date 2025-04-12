"use client";
import { AppProvider } from "@/app/context/provider";
import { Footer } from "@/include/footer";
import Header from "@/include/header";

export default function App({ children }) {
  return (
    <AppProvider>
         <Header />
         <main className="flex flex-col min-h-[600px]">
      {children}
      </main>
      <Footer/>
    </AppProvider>
  );
}
