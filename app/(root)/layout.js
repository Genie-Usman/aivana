import MobileNav from '../../components/shared/MobileNav';
import Sidebar from '../../components/shared/Sidebar';
import React from 'react';

const Layout = ({ children }) => {
  return (
    <main className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      {/* Sidebar should take full height */}
      <Sidebar className="h-screen" />
        <MobileNav/>
      {/* Content should not push the sidebar down */}
      <div className="flex-1 overflow-auto py-8 lg:max-h-screen lg:py-10">
        <div className="max-w-5xl mx-auto w-full px-5 md:px-10 text-dark-400 text-base font-normal leading-[140%]">
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
