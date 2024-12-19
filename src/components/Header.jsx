import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import React from 'react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/PROPS_logo-black.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='flex justify-around items-center shadow-sm p-5'>
      <Link to='/' aria-label="Go to Home">
        <img src={logo} alt="PropsMaster Logo" width={250} height={100} />
      </Link>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex gap-12'>
        <Link to='/' className='menu-li font-light hover:scale-105 hover:font-medium transition-all cursor-pointer hover:text-primary'>
          Αρχική
        </Link>
        <Link to='/listings' className='menu-li font-light hover:scale-105 hover:font-medium transition-all cursor-pointer hover:text-primary'>
          Αγγελίες
        </Link>
        <Link to='/about' className='menu-li font-light hover:scale-105 hover:font-medium transition-all cursor-pointer hover:text-primary'>
          Σχετικά Με Εμάς
        </Link>
        <Link to='/contact' className='menu-li font-light hover:scale-105 hover:font-medium transition-all cursor-pointer hover:text-primary'>
          Επικοινωνία
        </Link>
      </ul>

      {/* User Actions */}
      <div className='flex items-center gap-5'>
        <SignedIn>
          {/* UserButton and Redirect to Add Listing */}
          <Button className='hover:bg-[#f5945c] hover:scale-105 transition-all' onClick={() => navigate('/profile')}>Νέα Καταχώρηση</Button>
          <UserButton/>
        </SignedIn>
        <SignedOut>
          {/* Sign In Button */}
          <SignInButton mode='modal'>
            <Button>Νέα Καταχώρηση</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Header;
