// import React, { useEffect, useState, useRef } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { useNavigate } from 'react-router-dom';
// import { Separator } from '@radix-ui/react-select';
// import { useUserPlan } from './../src/context/UserPlanContext';
// import { useClerk } from '@clerk/clerk-react';
// import { useToast } from "@/hooks/use-toast";
// import { updateUserPlan } from './../configs/planManagment';
// import { db } from './../configs';
// import { ProductImages, ProductListing } from './../configs/schema';
// import { eq, desc } from 'drizzle-orm';
// import Service from './Shared/Service';

// // Initialize Stripe with live key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const ChoosePlan = () => {
//   const navigate = useNavigate();
//   const { setUserPlan, userPlan } = useUserPlan();
//   const { user, isLoaded } = useClerk();
//   const { toast } = useToast();
  
//   const [productList, setProductList] = useState([]);
//   const [currentPlanIndex, setCurrentPlanIndex] = useState(1);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const touchStartX = useRef(0);
//   const carouselRef = useRef(null);

//   // Production plans with live mode price IDs
//   const plans = [
//     {
//       name: 'Basic',
//       price: 0,
//       priceId: null,
//       features: [
//         'Δωρεάν λογαριασμός.',
//         'Ανέβασμα έως 5 αγγελιών ανά προφίλ.',
//         'Ανέβασμα έως 3 φωτογραφιών ανά αγγελία.',
//         'Τυπική ορατότητα στις αναζητήσεις.',
//         'Περιορισμένη διάρκεια καταχώρησης (30 ημέρες).',
//         'Βασικά στατιστικά (προβολές).',
//       ],
//     },
//     {
//       name: 'Boost',
//       price: 5,
//       priceId: import.meta.env.VITE_STRIPE_BOOST_PRICE_ID,
//       features: [
//         'Ανέβασμα έως 20 αγγελιών ανά προφίλ.',
//         'Βελτιωμένα χαρακτηριστικά Καταχώρησης.',
//         'Προτεραιότητα στις αναζητήσεις.',
//         'Επεκτεταμένη διάρκεια καταχώρησης (έως 45 ημέρες).',
//         'Στατιστικά υψηλής ανάλυσης.',
//         'Προτεραιότητα στην εξυπηρέτηση πελατών.',
//       ],
//     },
//     {
//       name: 'Boost+',
//       price: 7,
//       priceId: import.meta.env.VITE_STRIPE_BOOST_PLUS_PRICE_ID,
//       features: [
//         'Απεριόριστα ανεβάσματα αγγελιών.',
//         'Αποκλειστικά χαρακτηριστικά καταχώρησης.',
//         'Κορυφαία ορατότητα στις αναζητήσεις.',
//         'Απεριόριστη διάρκεια καταχώρησης.',
//         'Αποκλειστική επικοινωνία με αγοραστές και πωλητές.',
//       ],
//     },
//   ];

//   const handlePlanClick = async (planName) => {
//     if (!user) {
//       toast({
//         variant: 'destructive',
//         title: "Σφάλμα",
//         description: "Παρακαλώ συνδεθείτε για να επιλέξετε συνδρομή.",
//         duration: 5000,
//       });
//       return;
//     }

//     // Check if user is trying to select Basic plan with 5 or more listings
//     if (planName === 'Basic' && productList.length >= 5 && userPlan === 'Basic') {
//       toast({
//         variant: 'destructive',
//         title: "Σφάλμα",
//         description: "Έχετε φτάσει το όριο των 5 αγγελιών για το Βασικό πακέτο. Παρακαλώ αναβαθμίστε σε Boost ή Boost+.",
//         duration: 5000,
//       });
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const plan = plans.find(p => p.name === planName);
//       console.log('Selected plan:', plan);

//       if (!plan) {
//         throw new Error('Invalid plan selected');
//       }

//       // Handle free plan
//       if (plan.name === 'Basic') {
//         const updatedPlan = await updateUserPlan(user.id, planName);
//         if (updatedPlan) {
//           setUserPlan(planName);
//           navigate('/BasicListing');
//         }
//         return;
//       }

//       // Verify price ID exists
//       if (!plan.priceId) {
//         throw new Error('Price ID not configured for plan: ' + planName);
//       }

//       const checkoutData = {
//         priceId: plan.priceId,
//         userId: user.id,
//         userEmail: user.emailAddresses[0].emailAddress,
//         planName: plan.name
//       };

//       console.log('Sending checkout data:', checkoutData);

//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(checkoutData)
//       });

//       const data = await response.json();
//       console.log('Response data:', data);

//       if (!response.ok) {
//         throw new Error(data.error || 'Payment failed');
//       }

//       // Initialize Stripe
//       const stripe = await stripePromise;
//       if (!stripe) {
//         throw new Error('Stripe failed to initialize');
//       }

//       const { error } = await stripe.redirectToCheckout({
//         sessionId: data.sessionId
//       });

//       if (error) {
//         throw error;
//       }

//     } catch (error) {
//       console.error('Subscription error:', error);
//       setError(error.message);
//       toast({
//         variant: 'destructive',
//         title: "Σφάλμα",
//         description: error.message || 'An unexpected error occurred',
//         duration: 5000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const GetUserProductListing = async () => {
//     try {
//       const result = await db
//         .select()
//         .from(ProductListing)
//         .leftJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
//         .where(eq(ProductListing.createdBy, user?.primaryEmailAddress?.emailAddress))
//         .orderBy(desc(ProductListing.id));

//       const resp = Service.FormatResult(result);
//       setProductList(resp);
//     } catch (error) {
//       console.error('Error fetching user listings:', error);
//       toast({
//         variant: 'destructive',
//         title: "Σφάλμα",
//         description: "Failed to fetch user listings",
//         duration: 5000,
//       });
//     }
//   };

//   // Mobile touch handlers
//   const handleTouchStart = (e) => {
//     touchStartX.current = e.touches[0].clientX;
//   };

//   const handleTouchEnd = (e) => {
//     const touchEndX = e.changedTouches[0].clientX;
//     const deltaX = touchStartX.current - touchEndX;
//     const minSwipeDistance = 50;

//     if (Math.abs(deltaX) > minSwipeDistance) {
//       if (deltaX > 0 && currentPlanIndex < plans.length - 1) {
//         setCurrentPlanIndex(prev => prev + 1);
//       } else if (deltaX < 0 && currentPlanIndex > 0) {
//         setCurrentPlanIndex(prev => prev - 1);
//       }
//     }
//   };

//   const renderPlanButton = (plan) => {
//     const isBasicPlanDisabled = plan.name === 'Basic' && productList.length >= 5 && userPlan === 'Basic';
    
//     return (
//       <button 
//         className={`choosePlan-button ${loading || isBasicPlanDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
//         disabled={loading || isBasicPlanDisabled}
//         onClick={() => handlePlanClick(plan.name)}
//       >
//         {loading ? 'Επεξεργασία...' : 
//          isBasicPlanDisabled ? 'Όριο Αγγελιών Συμπληρώθηκε' :
//          plan.name === 'Basic' ? 'Ανεβάστε Δωρεάν' : 
//          `Αναβάθμιση σε ${plan.name}`}
//       </button>
//     );
//   };

//   useEffect(() => {
//     if (user) {
//       GetUserProductListing();
//     }
//   }, [user]);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     checkScreenSize();
//     window.addEventListener('resize', checkScreenSize);
//     return () => window.removeEventListener('resize', checkScreenSize);
//   }, []);

//   // Center Boost plan on mobile
//   useEffect(() => {
//     if (isMobile) {
//       setCurrentPlanIndex(1);
//     }
//   }, [isMobile]);

//   return (
//     <div>
//       <Header />
//       <div className="choosePlan-container">
//         <div
//           ref={carouselRef}
//           className="choosePlan-carousel"
//           style={isMobile ? {
//             transform: `translateX(-${currentPlanIndex * 100}%)`,
//             transition: 'transform 0.3s ease-out'
//           } : {}}
//           onTouchStart={handleTouchStart}
//           onTouchEnd={handleTouchEnd}
//         >
//           {plans.map((plan, index) => (
//             <div
//               className={`choosePlan-${plan.name.toLowerCase()}Plan choosePlan-slide`}
//               key={index}
//             >
//               <h2 className="choosePlan-title">
//                 Πακέτο
//                 <span className={`choosePlan-highlight ${
//                   plan.name === 'Basic' 
//                     ? 'choosePlan-basicHighlight' 
//                     : plan.name === 'Boost'
//                     ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-inter font-bold'
//                     : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 font-dancing-script font-bold'
//                 }`}>
//                   {plan.name}
//                 </span>
//                 {plan.name === 'Boost' && <span className="choosePlan-popular">(Δημοφιλέστερο)</span>}
//               </h2>
//               <Separator className="choosePlan-separator" />
//               <p className="choosePlan-sideTitle">
//                 {plan.name === 'Basic'
//                   ? 'Ξεκινήστε με τις βασικές λειτουργίες της πλατφόρμας μας χωρίς κόστος.'
//                   : plan.name === 'Boost'
//                   ? 'Αυξήστε την ορατότητα και τις δυνατότητες για μια πιο επαγγελματική εμπειρία καταχώρησης.'
//                   : 'Ξεκλειδώστε απεριόριστες δυνατότητες για τη μέγιστη ορατότητα και προηγμένα εργαλεία πώλησης.'}
//               </p>
//               <ul className="choosePlan-features">
//                 {plan.features.map((feature, idx) => (
//                   <li key={idx}>{feature}</li>
//                 ))}
//               </ul>
//               <h2 className="choosePlan-price">
//                 {plan.name !== 'Basic' && 'Μόνο '}
//                 <span className="choosePlan-priceAmount">{plan.price} €</span>/Μήνα
//               </h2>
//               {renderPlanButton(plan)}
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ChoosePlan;

import React, { useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/Header';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@radix-ui/react-select';
import { useUserPlan } from './../src/context/UserPlanContext';
import { useClerk } from '@clerk/clerk-react';
import { useToast } from "@/hooks/use-toast";
import { updateUserPlan } from './../configs/planManagment';
import { db } from './../configs';
import { ProductImages, ProductListing } from './../configs/schema';
import { eq, desc } from 'drizzle-orm';
import Service from './Shared/Service';

// Initialize Stripe with live key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ChoosePlan = () => {
  const navigate = useNavigate();
  const { setUserPlan, userPlan } = useUserPlan();
  const { user, isLoaded } = useClerk();
  const { toast } = useToast();
  
  const [productList, setProductList] = useState([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0); // Start at index 0 (Basic plan)
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const touchStartX = useRef(0);
  const carouselRef = useRef(null);

  // Modified plans array with coming soon messages
  const plans = [
    {
      name: 'Basic',
      price: 0,
      priceId: null,
      features: [
        'Δωρεάν λογαριασμός.',
        'Ανέβασμα έως 50 αγγελιών ανά προφίλ.',
        'Ανέβασμα έως 4 φωτογραφιών ανά αγγελία.',
        'Τυπική ορατότητα στις αναζητήσεις.',
        'Βασικά στατιστικά (προβολές).',
      ],
      isComingSoon: false
    },
    {
      name: 'Boost',
      price: null,
      priceId: null,
      features: ['Σύντομα κοντά σας με περισσότερες λειτουργείες'],
      isComingSoon: true
    },
    {
      name: 'Boost+',
      price: null,
      priceId: null,
      features: ['Σύντομα κοντά σας με περισσότερες λειτουργείες'],
      isComingSoon: true
    },
  ];

  const handlePlanClick = async (planName) => {
    // Only handle Basic plan
    if (planName !== 'Basic') {
      return;
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: "Παρακαλώ συνδεθείτε για να επιλέξετε συνδρομή.",
        duration: 5000,
      });
      return;
    }

    if (planName === 'Basic' && productList.length >= 5 && userPlan === 'Basic') {
      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: "Έχετε φτάσει το όριο των 5 αγγελιών για το Βασικό πακέτο.",
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedPlan = await updateUserPlan(user.id, planName);
      if (updatedPlan) {
        setUserPlan(planName);
        navigate('/BasicListing');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message);
      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: error.message || 'An unexpected error occurred',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const GetUserProductListing = async () => {
    try {
      const result = await db
        .select()
        .from(ProductListing)
        .leftJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
        .where(eq(ProductListing.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(ProductListing.id));

      const resp = Service.FormatResult(result);
      setProductList(resp);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: "Failed to fetch user listings",
        duration: 5000,
      });
    }
  };

  // const handleTouchStart = (e) => {
  //   touchStartX.current = e.touches[0].clientX;
  // };

  // const handleTouchEnd = (e) => {
  //   const touchEndX = e.changedTouches[0].clientX;
  //   const deltaX = touchStartX.current - touchEndX;
  //   const minSwipeDistance = 50;

  //   if (Math.abs(deltaX) > minSwipeDistance) {
  //     if (deltaX > 0) {
  //       // Swipe left (next plan)
  //       setCurrentPlanIndex(prev => Math.min(prev + 1, plans.length - 1));
  //     } else {
  //       // Swipe right (previous plan)
  //       setCurrentPlanIndex(prev => Math.max(prev - 1, 0));
  //     }
  //   }
  // };

  const renderPlanButton = (plan) => {
    if (plan.isComingSoon) {
      return (
        <button 
          className="choosePlan-button opacity-50 cursor-not-allowed"
          disabled={true}
        >
          Σύντομα Διαθέσιμο
        </button>
      );
    }

    const isBasicPlanDisabled = plan.name === 'Basic' && productList.length >= 5 && userPlan === 'Basic';
    
    return (
      <button 
        className={`choosePlan-button ${loading || isBasicPlanDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
        disabled={loading || isBasicPlanDisabled}
        onClick={() => handlePlanClick(plan.name)}
      >
        {loading ? 'Επεξεργασία...' : 
         isBasicPlanDisabled ? 'Όριο Αγγελιών Συμπληρώθηκε' :
         'Ανεβάστε Δωρεάν'}
      </button>
    );
  };

  useEffect(() => {
    if (user) {
      GetUserProductListing();
    }
  }, [user]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div>
      <Header />
      <div className="choosePlan-container flex flex-col-reverse">
        {/* {isMobile && (
          <div className="flex justify-center gap-2 mb-4">
            {plans.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentPlanIndex === index ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )} */}
        <div
          ref={carouselRef}
          className="choosePlan-carousel"
          style={isMobile ? {
            transform: `translateX(-${currentPlanIndex * 100}%)`,
            transition: 'transform 0.3s ease-out'
          } : {}}
          // onTouchStart={handleTouchStart}
          // onTouchEnd={handleTouchEnd}
        >
          {plans.map((plan, index) => (
            <div
              className={`choosePlan-${plan.name.toLowerCase()}Plan choosePlan-slide min-h-[600px] flex flex-col`}
              key={index}
            >
              <h2 className="choosePlan-title">
                Πακέτο
                <span className={`choosePlan-highlight ${
                  plan.name === 'Basic' 
                    ? 'choosePlan-basicHighlight' 
                    : plan.name === 'Boost'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-inter font-bold'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 font-dancing-script font-bold'
                }`}>
                  {plan.name}
                </span>
                {plan.name === 'Boost' && !plan.isComingSoon && <span className="choosePlan-popular">(Δημοφιλέστερο)</span>}
              </h2>
              <Separator className="choosePlan-separator" />
              <p className="choosePlan-sideTitle">
                {plan.isComingSoon ? 'Σύντομα διαθέσιμο με νέες συναρπαστικές λειτουργίες.' :
                 'Ξεκινήστε με τις βασικές λειτουργίες της πλατφόρμας μας χωρίς κόστος.'}
              </p>
              <ul className="choosePlan-features flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <h2 className="choosePlan-price">
                {plan.isComingSoon ? (
                  <span className="choosePlan-priceAmount">Σύντομα</span>
                ) : (
                  <>
                    <span className="choosePlan-priceAmount">{plan.price} €</span>/Μήνα
                  </>
                )}
              </h2>
              {renderPlanButton(plan)}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChoosePlan;