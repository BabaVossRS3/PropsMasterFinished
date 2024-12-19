import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom'
import Home from './home'
import Contact from './contact'
import { ClerkProvider } from '@clerk/clerk-react'
import Profile from './profile'
import AddListing from './AddListing.jsx'
import { Toaster } from './components/ui/toaster'
import Search from './components/Search'
import SearchByCategory from './search/[category]'
import SearchByOptions from './search'
import '@fontsource/roboto';
import ListingDetail from './listing-details/[id]'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/contact',
    element: <Contact/>
  },
  {
    path: '/profile',
    element: <Profile/>
  },
  {
    path: '/addListing',
    element: <AddListing/>
  },
  {
    path:'/search/:category',
    element:<SearchByCategory/>
  },
  {
    path:'/search',
    element:<SearchByOptions/>
  },
  {
    path:'/listing-details/:id',
    element:<ListingDetail/>
  },
])

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <RouterProvider router={router} />
        <Toaster/>
     </ClerkProvider>
  </StrictMode>,
)
