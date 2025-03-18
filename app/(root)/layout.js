import React from 'react'

const layout = ({ children }) => {
    return (
        <main className='flex min-h-screen w-full flex-col bg-white lg:flex-row'>
            <div className='mt-16 flex-1 overflow-auto py-8 lg:mt-0 lg:max-h-screen lg:py-10'>
                <div className="max-w-5xl mx-auto px-5 md:px-10 w-full text-dark-400 font-normal text-[16px] leading-[140%]">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default layout