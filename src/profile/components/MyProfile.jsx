
import React, { useEffect, useState } from 'react';
import { useUser, useClerk, SignOutButton } from '@clerk/clerk-react';
import { ProductListing, ProductImages } from './../../../configs/schema';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import DeleteListingsButton from './../../AddListing.jsx/components/DeleteAllListings';
import { useUserPlan } from './../../context/UserPlanContext';
import { fixUserPlanStatus } from './../../../configs/planManagment';
import { updateUserPlan } from './../../../configs/planManagment';
import { getCurrentUserPlan } from './../../../configs/planManagment';
import { useNavigate } from 'react-router-dom';
import { cancelUserPlan } from './../../../configs/planManagment';
import ProfilePictureUpload from '@/AddListing.jsx/components/ProfilePictureUploader';


const MyProfile = ({ totalListings, endDate }) => {
  const { setUserPlan, userPlan } = useUserPlan();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);
  const [remainingDays, setRemainingDays] = useState(null);
  const navigate = useNavigate();  
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleExpiredPlan = () => {
    setUserPlan(null);
    setRemainingDays(null);
    toast({
        variant: 'destructive',
        title: 'Επιλέξτε Συνδρομή',
        description: 'Η συνδρομή σας έχει λήξει. Θα μεταφερθείτε στην σελίδα επιλογής πακέτου.',
        status: 'warning',
    });
    // Redirect to choose plan page after a short delay
    setTimeout(() => {
        navigate('/choosePlan');
    }, 2000);
};
const calculateRemainingDays = (endDate) => {
    try {
        if (!endDate) {
            setRemainingDays(null);
            return;
        }
        
        const end = new Date(endDate);
        const now = new Date();
        
        // Calculate remaining days
        const remainingTime = end.getTime() - now.getTime();
        const daysLeft = Math.max(Math.ceil(remainingTime / (1000 * 60 * 60 * 24)), 0);
        
        console.log('End date:', end);
        console.log('Current date:', now);
        console.log('Days left:', daysLeft);
        
        setRemainingDays(daysLeft);

        // Show notifications based on remaining days
        if (daysLeft <= 5 && daysLeft > 0) {
            toast({
                title: 'Ειδοποίηση Συνδρομής',
                description: `Η συνδρομή σας λήγει σε ${daysLeft} ημέρες.`,
                status: 'warning',
            });
        } else if (daysLeft === 0) {
            toast({
                title: 'Λήξη Συνδρομής',
                description: 'Η συνδρομή σας έχει λήξει. Παρακαλώ ανανεώστε την.',
                status: 'error',
            });
            setUserPlan(null); // Clear the user plan when expired
        }
    } catch (error) {
        console.error('Error calculating remaining days:', error);
        setRemainingDays(null);
    }
};
const handleCancelPlan = async () => {
  if (!user?.id || !userPlan) return;

  try {
      await cancelUserPlan(user.id.trim());
      
      setUserPlan(null);
      setRemainingDays(null);
      
      toast({
          className: "bg-green-500 text-white",
          title: 'Επιτυχής Διακοπή',
          description: 'Η συνδρομή σας έχει διακοπεί επιτυχώς.',
          status: 'success',
          duration: 5000,
      });

      // Redirect to plan selection
      setTimeout(() => {
          navigate('/choosePlan');
      }, 2000);
  } catch (error) {
      console.error('Error canceling plan:', error);
      toast({
          variant:'destructive',
          title: 'Σφάλμα',
          description: 'Υπήρξε πρόβλημα με την διακοπή της συνδρομής σας.',
          status: 'error',
          duration: 5000,
      });
  }
};
const handleAddListing = () => {
  if (!userPlan) {
      toast({
          title: "Απαιτείται Συνδρομή",
          description: "Παρακαλώ επιλέξτε ένα πακέτο για να προσθέσετε αγγελία.",
          status: "warning",
          duration: 5000,
      });
      navigate('/choosePlan');
      return;
  }

  // Navigate based on current plan
  switch(userPlan) {
      case 'Basic':
          navigate('/BasicListing');
          break;
      case 'Boost':
          navigate('/BoostListing');
          break;
      case 'Boost+':
          navigate('/BoostPlusListing');
          break;
      default:
          // Fallback to plan selection if plan is invalid
          toast({
              title: "Σφάλμα Συνδρομής",
              description: "Παρακαλώ επιλέξτε ξανά το πακέτο σας.",
              status: "error",
              duration: 5000,
          });
          navigate('/choosePlan');
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
      setTotalListings(resp.length);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    } finally {
      setLoading(false);
    }
  };
const handleProfileImageUpload = async (file) => {
  try {
    setUploading(true);
    
    // Create a FormData instance
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    // Here you would typically make an API call to your backend
    // to handle the image upload and update the user's profile
    // For example:
    // await uploadProfileImage(formData);
    
    toast({
      title: 'Επιτυχής Ενημέρωση',
      description: 'Η φωτογραφία προφίλ ενημερώθηκε με επιτυχία.',
      status: 'success',
    });
    
  } catch (error) {
    console.error('Error uploading profile image:', error);
    toast({
      variant: 'destructive',
      title: 'Σφάλμα',
      description: 'Υπήρξε πρόβλημα με την ενημέρωση της φωτογραφίας.',
    });
  } finally {
    setUploading(false);
  }
};

useEffect(() => {
  const fetchUserPlanAndSubscriptionDate = async () => {
      if (!isLoaded || !user?.id) return;

      try {
          setLoading(true);

          // Get current plan status
          const currentPlan = await getCurrentUserPlan(user.id.trim());
          console.log('Current plan:', currentPlan);

          if (currentPlan && currentPlan.isActive) {
              setUserPlan(currentPlan.plan);
              
              // Handle remaining days
              if (currentPlan.remainingDays === 0) {
                  handleExpiredPlan();
              } else {
                  setRemainingDays(currentPlan.remainingDays);
                  
                  // Warning when 5 or fewer days remain
                  if (currentPlan.remainingDays <= 5) {
                      toast({
                          title: 'Ειδοποίηση Συνδρομής',
                          description: `Η συνδρομή σας λήγει σε ${currentPlan.remainingDays} ημέρες.`,
                          status: 'warning',
                      });
                  }
              }
          } else {
              setUserPlan(null);
              setRemainingDays(null);

              // If user had a plan but it expired, show notification
              if (currentPlan) {
                  toast({
                      title: 'Λήξη Συνδρομής',
                      description: 'Η συνδρομή σας έχει λήξει. Παρακαλώ επιλέξτε νέο πακέτο.',
                      status: 'info',
                  });
              }

              // Handle expired plan when there is no current plan
              handleExpiredPlan();
          }
      } catch (error) {
          console.error('Error fetching user plan:', error);
          toast({
              title: 'Σφάλμα',
              description: 'Υπήρξε πρόβλημα με την ανάκτηση των στοιχείων της συνδρομής σας.',
              status: 'error',
          });
      } finally {
          setLoading(false);
      }
  };
  fetchUserPlanAndSubscriptionDate();

  // Check subscription status every minute
  const pollInterval = setInterval(fetchUserPlanAndSubscriptionDate, 60000);
  
  return () => clearInterval(pollInterval);
}, [isLoaded, user, setUserPlan, navigate, endDate]);


  if (!isLoaded || !user?.id) {
      return <div className="w-full h-[200px] rounded-xl bg-orange-100 animate-pulse">Φορτώνει...</div>;
  }

  return (
  <div className="myProfile-container">
    {/* Profile section */}
    <div className="myProfile-profile">
    <div className="myProfile-avatar">
      <ProfilePictureUpload
        defaultImageUrl={user.imageUrl}
        onImageUpload={handleProfileImageUpload}
        uploading={uploading}
      />
    </div>
      <div className="myProfile-userDetails">
        <h2 className="myProfile-userName">
          {user.firstName} {user.lastName}
        </h2>
        <p className="myProfile-userEmail">{user.primaryEmailAddress.emailAddress}</p>
      </div>
    </div>

    <div className="myProfile-info">
      {/* Listings count */}
      <div className="myProfile-listingsCount">
        <h2 className="myProfile-sectionTitle">Σύνολο Αγγελιών</h2>
        <p className="myProfile-sectionValue">{totalListings}</p>
      </div>

      {/* Subscription info */}
      <div className="myProfile-subscriptionInfo">
        <h2 className="myProfile-sectionTitle">Συνδρομές</h2>
        <div className="myProfile-subscriptionDetails">
          <p className={`myProfile-userPlan ${userPlan ? `myProfile-userPlan--${userPlan}` : 'myProfile-userPlan--none'}`}>
            {userPlan || 'Δεν έχει οριστεί συνδρομή'}
          </p>
          <a className="myProfile-upgradeLink" href="/choosePlan">Αλλαγή Συνδρομής</a>
        </div>
      </div>

      {/* Subscription expiry */}
      <div className="myProfile-subscriptionExpiry">
        <h2 className="myProfile-sectionTitle"
        >Λήξη Συνδρομής</h2>
        <div className="myProfile-expiryDetails">
          <p className="myProfile-expiryText">
            {remainingDays !== null ? `${remainingDays} Μέρες` : 'Πληροφορίες λήξης δεν είναι διαθέσιμες'}
          </p>
          <button 
              onClick={() => {
                  if (window.confirm('Είστε σίγουροι ότι θέλετε να διακόψετε την συνδρομή σας;')) {
                      handleCancelPlan();
                  }
              }}
              className='font-light text-sm focus:outline-none underline hover:text-orange-500 bg-transparent border-none outline-none'
              >
              Διακοπή
          </button>
        </div>
      </div>
    </div>

    {/* Action buttons */}
    <div className="myProfile-actions">
      <div className="myProfile-action">
      <DeleteListingsButton
        onDeleted={() => {
          // This will trigger a refresh of your listings
          GetUserProductListing();
          toast({
            title: 'Επιτυχής Διαγραφή',
            description: 'Όλες οι αγγελίες διαγράφηκαν με επιτυχία.'
          });
        }}
      />
      </div>

      <div className="myProfile-action">
        <SignOutButton mode="modal">
          <Button className="myProfile-signOutButton">
            Αποσύνδεση
          </Button>
        </SignOutButton>
      </div>
    </div>
  </div>
);

};

export default MyProfile;
