import { navLinks } from '../../constants'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { getAllImages } from '../../lib/actions/Image.actions'
import Collection from '../../components/shared/Collection'

const Home = async ({searchParams}) => {
  const page = await (searchParams?.page) || 1;
  const searchQuery = await (searchParams?.query) || '';

  const images = await getAllImages({ page, searchQuery})
  return (
    <div>
      <section className="hidden sm:flex sm:items-center sm:justify-center h-72 flex-col gap-4 rounded-2xl  bg-[url('/assets/images/banner-bg.png')] bg-cover bg-no-repeat p-10 shadow-inner">
        <h1 className='text-[36px] font-semibold sm:text-[44px] leading-[120%] sm:leading-[56px] max-w-[500px] flex-wrap text-center text-white'>
          Unleash Your Creative Vision With Aivana
        </h1>
        <ul className="flex items-center justify-center w-full gap-20 text-white">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex items-center justify-center flex-col gap-2 group"
            >
              <div className="w-14 h-14 flex items-center justify-center">
                <div 
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm transition-all duration-300 transform-gpu origin-center group-hover:shadow-md group-hover:shadow-purple-300/30 group-hover:scale-110"
                >
                  <Image 
                    src={link.icon} 
                    alt="image" 
                    width={24} 
                    height={24} 
                    className="pointer-events-none"
                  />
                </div>
              </div>
              <p className="font-medium text-[14px] leading-[120%] text-center text-white transition-colors duration-300 group-hover:text-purple-200">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>
      <section className="sm:mt-12">
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </div>
  )
}

export default Home
