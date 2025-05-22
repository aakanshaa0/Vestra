import React from 'react';
import { assets} from '../assets/frontend_assets/assets';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
      const navigate = useNavigate();
  return (
    <div className='flex flex-col sm:flex-row border border-gray-700 rounded'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center px-4 py-10 md:py-6 lg:py-6 sm:px-6 bg-white'>
        <div className='text-gray-800 w-full max-w-md space-y-6'>
          <p className='font-serif text-3xl sm:text-5xl font-bold'>
            Elevate Your Wardrobe with Confidence
          </p>
          <p className='test-base sm:text-lg'>
            Discover the latest trends in fashion with our handpicked collections for every mood and moment. Quality, comfort, and style—all in one place.
          </p>
          <button onClick={() => navigate('/collection')} className='bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition'>
            Shop Now
          </button>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2'>
        <div className='w-full h-64 sm:h-full bg-gray-300 flex items-center justify-center text-gray-600'>
            <img src={assets.hero_img} alt='Hero Image' className='w-full h-full object-cover'/>
        </div>
      </div>
    </div>
  );
};

export default Hero;
