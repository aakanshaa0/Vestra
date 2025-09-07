import React, { useState, useContext }  from 'react';
import { Link, NavLink } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { IoBagOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  
  const handleSearchClick = () => {
    setShowSearch(true);
    navigate('/collection');
  };

  const handleLogout = () => {
    //Remove authentication tokens but keep cart items
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
    
    alert('Logged out successfully! Your cart items are saved.');
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to='/'><h1 className='text-4xl font-mono font-bold italic cursor-pointer flex flex-row items-center gap-2'>VESTRA</h1></Link>
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
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
        <a href='http://localhost:5174' target='_blank' rel='noopener noreferrer' className='flex flex-col items-center gap-1'>
          <p className='border-2 border-gray-700 rounded-full px-3 py-0.2 hover:bg-gray-700 hover:text-white transition-all duration-300'>ADMIN</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </a>
      </ul>
        <div className='flex items-center gap-5'>
          <IoIosSearch className='h-[25px] w-[25px] cursor-pointer' onClick={handleSearchClick}/>
          <div className='group relative'>
            <IoPersonOutline className='h-[25px] w-[25px] cursor-pointer' />
            <div className='hidden group-hover:block absolute dropdown-menu right-0 pt-4'>
              {localStorage.getItem('token') ? (
                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                  <Link to='/profile' className='cursor-pointer hover:text-black'>My Profile</Link>
                  <Link to='/orders' className='cursor-pointer hover:text-black'>Orders</Link>
                  <a href='http://localhost:5174' target='_blank' rel='noopener noreferrer' className='cursor-pointer hover:text-black'>Admin Panel</a>
                  <p className='cursor-pointer hover:text-black' onClick={handleLogout}>Logout</p>
                </div>
              ) : (
                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                  <Link to='/login' className='cursor-pointer hover:text-black'>Login</Link>
                  <a href='http://localhost:5174' target='_blank' rel='noopener noreferrer' className='cursor-pointer hover:text-black'>Admin Panel</a>
                </div>
              )}
            </div>
          </div>
          <Link to='/cart' className='relative'>
            <IoBagOutline className='h-[25px] w-[25px] cursor-pointer' />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
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
          <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={()=> setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          <a href='http://localhost:5174' target='_blank' rel='noopener noreferrer' className='py-2 pl-6 border cursor-pointer hover:bg-gray-50'>ADMIN PANEL</a>
        </div>
      </div>
    </div>
  )
}

export default Navbar