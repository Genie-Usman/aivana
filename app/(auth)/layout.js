import React from 'react'

const Layout = ({ children }) => {
    return (
        <main className='flex-center min-h-screen w-full bg-[#F4F7FE]'>
            {children}
        </main>
    )
}

export default Layout
{ children }