"use client";
import { AppProvider } from "@/app/context/provider";
import { Footer } from "@/include/footer";
import Header from "@/include/header";

export default function App({ children }) {
  return (
    <AppProvider>
         <Header />
      {children}
      <Footer/>
    </AppProvider>
  );
}
