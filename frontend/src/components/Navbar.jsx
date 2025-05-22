import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import  { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { SiOctopusdeploy   } from "react-icons/si";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <h1 className='text-3xl font-serif cursor-pointer flex flex-row items-center gap-2'><SiOctopusdeploy   />Seapher</h1>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/colletction' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
        <div className='flex items-center gap-5'>
          <IoIosSearch className='h-[25px] w-[25px] cursor-pointer' />
          <div className='group relative'>
            <IoPersonOutline className='h-[25px] w-[25px] cursor-pointer' />
            <div className='hidden group-hover:block absolute dropdown-menu right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p className='cursor-pointer hover:text-black'>Orders</p>
                <p className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          </div>
          <Link to='/cart' className='relative'>
            <IoBagOutline className='h-[25px] w-[25px] cursor-pointer' />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>10</p>
            <div />
          </Link>
          <IoIosMenu onClick={() => setVisible(true)} className='h-[35px] w-[25px] cursor-pointer sm:hidden' />
        </div>
        {/*Sidebar Menu for Small screen*/}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible? 'w-full':'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={()=> setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <MdArrowBackIos className='h-[17px] w-[17px] cursor-pointer' />
            <p>Back</p>
          </div>
          <NavLink className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar