import React, {useContext, useState, useEffect} from 'react'
import { ShopContext } from '../context/ShopContext';
import { CiSearch } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import {useLocation} from 'react-router-dom';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/collection' && showSearch) {
            setVisible(true);
        } 
        else {
            setVisible(false);
        }
    }, [location, showSearch]);

    if(!visible) return null;

  return showSearch ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
        <input value={search} onChange={(e)=>setSearch(e.target.value)} type='text' className='flex-1 outline-none bg-inherit text-sm' placeholder='Search'/>
        <CiSearch className='w-4'/>
        </div>
        <RxCross1 onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer'/>
    </div>
  ) : null
}

export default SearchBar