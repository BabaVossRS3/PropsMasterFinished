
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/PROPS_logo-black.png';
import { CiMenuFries } from "react-icons/ci"; // Importing the burger menu icon

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling menu

  // Define the handleClick function
  const handleClick = () => {
    // First, navigate to the home page
    navigate('/');
    
    // After a 1 second delay, reload the page
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-center shadow-sm p-5">
      <Link to="/" aria-label="Go to Home" className="mb-4 md:mb-0">
        <img src={logo} alt="PropsMaster Logo" width={250} height={100} />
      </Link>

      {/* Burger Menu (only visible on mobile) */}
      <div className="relative items-center  right-5 p-0 md:hidden flex  w-full justify-end">
        <button
          className='bg-transparent font-bold'
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu visibility
          aria-label="Toggle menu"
        >
          <CiMenuFries size={40} className="text-primary" />
        </button>
        <div className="">
          <UserButton/>
        </div>

  


      </div>

      {/* Mobile Navigation (Visible when burger menu is clicked) */}
      <ul
        className={`mb-10 md:hidden flex flex-col items-center gap-4 mt-4 transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? 'opacity-100 max-h-[300px]' : 'opacity-0 max-h-0'
        }`}
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out'
        }}
      >
        <Link
          to="/"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
          onClick={handleClick} // Trigger the reload after navigation
        >
          Αρχική
        </Link>
        <Link
          to="/aggelies"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
        >
          Αγγελίες
        </Link>
        <Link
          to="/about"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
        >
          Σχετικά Με Εμάς
        </Link>
        <Link
          to="/contact"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
        >
          Επικοινωνία
        </Link>
      </ul>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-12">
        {/* Home Link with reload logic */}
        <Link
          to="/"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
          onClick={handleClick} // Trigger the reload after navigation
        >
          Αρχική
        </Link>
        <Link
          to="/aggelies"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
        >
          Αγγελίες
        </Link>
        <Link
          to="/about"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
        >
          Σχετικά Με Εμάς
        </Link>
        {/* <Link
          to="/contact"
          className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
        >
          Επικοινωνία
        </Link> */}
        <SignedIn>
          <Link
            to="/profile?tab=my-listings"
            className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
          >
            Το Προφίλ Μου
          </Link>
        </SignedIn>
      </ul>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        <SignedIn>
          {/* UserButton and Redirect to Add Listing */}
          <Button
            className="md:mt-0 hover:bg-[#f5945c] hover:scale-105 transition-all"
            onClick={() => navigate('/profile?tab=my-listings')}
          >
            Νέα Καταχώρηση
          </Button>

          <div className="hidden md:block md:static">
            <UserButton />
          </div>

    
           </SignedIn>
        <SignedOut>
          {/* Sign In Button */}
          <SignInButton mode="modal">
            <Button className="hover:bg-[#f5945c] hover:scale-105 transition-all">
              Νέα Καταχώρηση
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
