import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/PROPS_logo-black.png';
import { CiMenuFries } from "react-icons/ci";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-around items-center shadow-sm p-5">
        {/* Top bar with logo and menu button on mobile */}
        <div className="w-full md:w-auto flex justify-between items-center mb-4 md:mb-0">
          <Link to="/" aria-label="Go to Home">
            <img src={logo} alt="PropsMaster Logo" width={130} height={100} />
          </Link>

          {/* Mobile Menu Button and User Button */}
          <div className="flex items-center gap-4 md:hidden">
            <UserButton />
            <button
              className="p-2 bg-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <CiMenuFries size={32} className="text-primary" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`w-full md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col items-center space-y-4 mt-4">
            <li>
              <Link
                to="/"
                className="menu-li font-medium text-lg hover:text-primary"
                onClick={() => {
                  handleClick();
                  setIsMenuOpen(false);
                }}
              >
                Αρχική
              </Link>
            </li>
            <li>
              <Link
                to="/aggelies"
                className="menu-li font-medium text-lg hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Αγγελίες
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="menu-li font-medium text-lg hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Σχετικά Με Εμάς
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link
                  to="/profile?tab=my-listings"
                  className="menu-li font-medium text-lg hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Το Προφίλ Μου
                </Link>
              </li>
            </SignedIn>
            <li className="pt-2">
              <SignedIn>
                <Button
                  className="hover:bg-[#f97216] hover:scale-105 transition-all"
                  onClick={() => {
                    navigate('/profile?tab=my-listings');
                    setIsMenuOpen(false);
                  }}
                >
                  Νέα Καταχώρηση
                </Button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="hover:bg-[#f97216] hover:scale-105 transition-all">
                    Νέα Καταχώρηση
                  </Button>
                </SignInButton>
              </SignedOut>
            </li>
          </ul>
        </div>

        {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-6 lg:gap-12">
          <Link
            to="/"
            className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
            onClick={handleClick}
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
          <SignedIn>
            <Link
              to="/profile?tab=my-listings"
              className="menu-li font-medium text-lg hover:scale-105 transition-all cursor-pointer hover:text-primary"
            >
              Το Προφίλ Μου
            </Link>
          </SignedIn>
        </ul>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-5">
          <SignedIn>
            <Button
              className="hover:bg-[#f68a41] bg-[#f97216] hover:scale-105 transition-all"
              onClick={() => navigate('/profile?tab=my-listings')}
            >
              Νέα Καταχώρηση
            </Button>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="hover:bg-[#f6985a] bg-[#f97216] hover:scale-105 transition-all">
                Νέα Καταχώρηση
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </>
    
  );
};

export default Header;