import Search from './Search'
import React from 'react'
import heroBackground from '../assets/live-stream-background-empowering-travel-food-content-creator-with-live-stream-social-media.jpg';


const Hero = () => {
  return (
    <div className="mb-16 relative">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#E78430]/55" />
      
      {/* Content Container */}
      <div className="relative flex flex-col items-center p-4 sm:p-6 md:p-8 lg:p-10 gap-4 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] w-full text-center">
        <h2 className='flex justify-center items-center pt-4 text-lg sm:text-base md:text-lg text-[#F5F5DC]'>
          Ο Κόσμος των Αντίκων στα Χέρια σας
        </h2>
        <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#F5F5DC] font-bold'>
          Βρείτε την Ιδανική Αντίκα
        </h2>
      
          <Search />
      </div>
    </div>
  );
};

export default Hero;
