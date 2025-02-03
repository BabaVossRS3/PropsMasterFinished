import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import AcceptPolicy from './AcceptPolicy';

const PolicyCheck = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [showPolicy, setShowPolicy] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Match the port with your Express server
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://propsmaster.gr' 
    : 'http://localhost:5173';

  useEffect(() => {
    const checkPolicyAcceptance = async () => {
      if (!isSignedIn || !user) {
        setIsChecking(false);
        return;
      }

      try {
        console.log('Checking policy for user:', user.id);
        const response = await fetch(`${API_URL}/api/policy/check?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Log the raw response for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        // Only try to parse if we have content
        if (responseText) {
          const data = JSON.parse(responseText);
          console.log('Parsed response:', data);
          if (!data.hasAccepted) {
            setShowPolicy(true);
          }
        } else {
          console.error('Empty response received from server');
        }
      } catch (error) {
        console.error('Error checking policy acceptance:', error);
        // Log additional error details
        if (error instanceof SyntaxError) {
          console.error('JSON parsing error:', error);
        }
      } finally {
        setIsChecking(false);
      }
    };

    if (isLoaded) {
      checkPolicyAcceptance();
    }
  }, [user, isLoaded, isSignedIn]);

  if (!isLoaded) return null;
  if (!isChecking || !isSignedIn) return <>{children}</>;

  return (
    <>
      {children}
      <AcceptPolicy 
        isOpen={showPolicy} 
        onOpenChange={setShowPolicy}
      />
    </>
  );
};

export default PolicyCheck;