import MobileNav from '../../components/shared/MobileNav';
import Sidebar from '../../components/shared/Sidebar';
import { Toaster } from "@/components/ui/sonner"
import React from 'react';

const Layout = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full bg-white">
      {/* Sidebar fixed to avoid shifting */}
      <div className="hidden lg:block fixed h-screen w-64">
        <Sidebar />
      </div>
      
      {/* Mobile Navigation (only for small screens) */}
      <div className="lg:hidden">
        <MobileNav />
      </div>

      {/* Content area with proper padding to avoid overlap */}
      <div className="mt-16 flex-1 lg:pl-72 overflow-auto py-8 lg:mt-0 lg:max-h-screen lg:py-10">
        <div className="max-w-5xl mx-auto w-full px-5 md:px-10 text-dark-400 text-base font-normal leading-[140%]">
          {children}
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
