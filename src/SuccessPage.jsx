// SuccessPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useUserPlan } from './../src/context/UserPlanContext';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserPlan } = useUserPlan();
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifySubscription(sessionId);
    }
  }, [searchParams]);

  const verifySubscription = async (sessionId) => {
    try {
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Set the user's plan in context
        setUserPlan(data.planType);

        toast({
          title: "Επιτυχία!",
          description: "Η συνδρομή σας ενεργοποιήθηκε επιτυχώς.",
          duration: 5000,
        });

        // Navigate based on plan type
        switch (data.planType) {
          case 'Boost':
            navigate('/BoostListing');
            break;
          case 'Boost+':
            navigate('/BoostPlusListing');
            break;
          default:
            navigate('/BasicListing');
        }
      } else {
        throw new Error(data.error || 'Failed to verify subscription');
      }
    } catch (error) {
      console.error('Error verifying subscription:', error);
      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: "Παρακαλώ επικοινωνήστε με την υποστήριξη.",
        duration: 5000,
      });
      // Redirect to choose plan on error
      navigate('/choosePlan');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Επεξεργασία της συνδρομής σας...</h1>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default SubscriptionSuccess;