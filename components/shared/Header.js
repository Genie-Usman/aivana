import React from 'react'

const Header = ({title, subTitle}) => {
  return (
    <>
    <h2 className="text-[30px] font-bold md:text-[36px] leading-[110%] text-[#2B3674] ">{title}</h2>
    {subTitle && <p className="font-normal text-[16px] leading-[140%] text-black pt-3">{subTitle}</p> }
    </>
  )
}

export default Header
