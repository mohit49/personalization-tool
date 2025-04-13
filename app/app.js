"use client";
import { AppProvider } from "@/app/context/provider";
import { Footer } from "@/include/footer";
import Header from "@/include/header";
import { usePathname } from "next/navigation";
export default function App({ children }) {
  const pathname = usePathname();
   // Regex to match /dashboard/:dashboardId/activity/:activityId
   const hideFooterPattern = /^\/dashboard\/[^/]+\/activity\/[^/]+$/;

   const shouldHideFooter = hideFooterPattern.test(pathname);
  return (
    <AppProvider>
         <Header />
         <main className="flex flex-col min-h-[600px]">
      {children}
      </main>
      {!shouldHideFooter && <Footer />}
    </AppProvider>
  );
}
