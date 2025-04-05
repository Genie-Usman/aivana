import MobileNav from '../../components/shared/MobileNav';
import Sidebar from '../../components/shared/Sidebar';
import { Toaster } from "@/components/ui/sonner"
import React from 'react';

const Layout = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full">
      <div className="hidden lg:block fixed h-screen w-64">
        <Sidebar />
      </div>
      
      <div className="lg:hidden">
        <MobileNav />
      </div>

      <div className="mt-16 flex-1 lg:pl-72 overflow-auto py-8 lg:mt-0 lg:max-h-screen lg:py-10">
        <div className="max-w-5xl mx-auto w-full px-5 md:px-10 text-dark-400 text-base font-normal leading-[140%]">
          {children}
        </div>
      </div>
      <Toaster 
          position="top-center"
          theme="dark"
          richColors={false}
        />
    </main>
  );
};

export default Layout;
