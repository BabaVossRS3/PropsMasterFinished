import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from './home'
import Contact from './contact'
import { ClerkProvider } from '@clerk/clerk-react'
import Profile from './profile'
import { Toaster } from './components/ui/toaster'
import Search from './components/Search'
import SearchByCategory from './search/[category]'
import SearchByOptions from './search'
import '@fontsource/roboto';
import ListingDetail from './listing-details/[id]'
import About from './about'
import Aggelies from './aggelies'
import ScrollToTopButton from './components/ScrollToTop'
import { CategoryProvider } from './components/CategoriesContext'; // Adjust the path
import ChoosePlan from './ChoosePlan'
import BasicListing from './AddListing.jsx/BasicListing.jsx'
import BoostListing from './AddListing.jsx/BoostListing'
import BoostPlusListing from './AddListing.jsx/BoostPlusListing'
import { UserPlanProvider } from './context/UserPlanContext'
import SubscriptionSuccess from './SuccessPage'
import ReportUser from './components/ReportUser'
import PrivacyPolicy from './components/policy/PrivacyPolicy'




const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/user',
    element: <Navigate to="https://propsmaster.gr" replace />
  },
  {
    path: '/contact',
    element: <Contact/>
  },
  {
    path: '/about',
    element:<About/>
  },
  {
    path:'/aggelies',
    element:<Aggelies/>
  },
  {
    path: '/profile',
    element: <Profile/>
  },
  {
    path: '/BasicListing',
    element: <BasicListing/>
  },
  {
    path: '/BoostListing',
    element: <BoostListing/>
  },
  {
    path: '/BoostPlusListing',
    element: <BoostPlusListing/>
  },
  {
    path: "/subscription-success",
    element: <SubscriptionSuccess />,
  },
  {
    path:'/search/:category',
    element:<SearchByCategory/>
  },
  {
    path:'/ReportUser',
    element:<ReportUser/>
  },
  {
    path:'/search',
    element:<SearchByOptions/>
  },
  {
    path:'/listing-details/:id',
    element:<ListingDetail/>
  },
  {
    path:'/choosePlan',
    element:<ChoosePlan/>
  },
  {
    path:'/Policy',
    element:<PrivacyPolicy/>
  },
])

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
      >
        <UserPlanProvider> 
        <CategoryProvider> {/* Add CategoryProvider here */}
          <RouterProvider router={router} />
        </CategoryProvider>
        <Toaster /> {/* Global Toast notifications */}
        <ScrollToTopButton /> {/* Scroll to top button */}
      </UserPlanProvider>
    </ClerkProvider>
  </StrictMode>
);