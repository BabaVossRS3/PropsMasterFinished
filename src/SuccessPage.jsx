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
    } else {
      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: "Δεν βρέθηκε αναγνωριστικό συνεδρίας.",
        duration: 5000,
      });
      navigate('/choosePlan');
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

      // Get the response text first
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse it as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Invalid server response format');
      }

      if (!response.ok) {
        console.error('Server error details:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.success) {
        // Check if planType exists in the response
        if (!data.planType) {
          throw new Error('Plan type not found in response');
        }

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
      
      // Provide more specific error messages based on error type
      let errorMessage = "Παρακαλώ επικοινωνήστε με την υποστήριξη.";
      
      if (error.message.includes('Invalid server response format')) {
        errorMessage = "Μη έγκυρη απάντηση από τον διακομιστή.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Πρόβλημα σύνδεσης με τον διακομιστή.";
      } else if (error.message.includes('Plan type not found')) {
        errorMessage = "Δεν βρέθηκε ο τύπος συνδρομής.";
      }

      toast({
        variant: 'destructive',
        title: "Σφάλμα",
        description: errorMessage,
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