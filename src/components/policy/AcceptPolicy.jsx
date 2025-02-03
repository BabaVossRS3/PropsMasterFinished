import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';

const AcceptPolicy = ({ isOpen, onOpenChange }) => {
  const { user } = useUser();
  const { signOut, deleteAccount } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setIsLoading(true);
      
      // Save policy acceptance to database
      const response = await fetch('/api/policy/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          version: '1.0', // Update this when policy changes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save policy acceptance');
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving policy acceptance:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      await signOut();
      await deleteAccount();
    } catch (error) {
      console.error('Error during rejection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-1xl max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Πολιτική Απορρήτου</h2>
          <PrivacyPolicy />
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isLoading ? 'Παρακαλώ περιμένετε...' : 'Αποδέχομαι'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? 'Παρακαλώ περιμένετε...' : 'Δεν αποδέχομαι'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptPolicy;