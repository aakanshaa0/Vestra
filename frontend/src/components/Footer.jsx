import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <Link to='/'><h1 className='text-4xl font-mono font-bold italic cursor-pointer flex flex-row items-center gap-2'>VESTRA</h1></Link>
                <p className='w-full md:sm:w-2/3 text-gray-600'>
                    VESTRA is your premier destination for fashion-forward clothing that combines style, quality, and affordability. We curate the latest trends and timeless classics to help you express your unique personality through fashion. Shop with confidence knowing every piece is selected with care for our valued customers.
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+1-000-000-0000</li>
                    <li>aakanshapande23@gmail.com</li>
                    <li>Instagram</li>
                </ul>
             </div>
        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025 - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer