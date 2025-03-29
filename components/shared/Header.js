import React from 'react';

const Header = ({ title, subTitle }) => {
  return (
    <header className="mb-6">
      <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#2B3674] tracking-tight">
        {title}
      </h2>
      {subTitle && (
        <p className="mt-3 text-lg text-gray-600 max-w-3xl leading-relaxed">
          {subTitle}
        </p>
      )}
    </header>
  );
};

export default Header;