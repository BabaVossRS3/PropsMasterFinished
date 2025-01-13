import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,AlertDialogAction,AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { db } from "../../../configs";
import { ProductImages, ProductListing } from "../../../configs/schema";
import { inArray, eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@clerk/clerk-react';

const DeleteAllListingsButton = ({ onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν βρέθηκε το email του χρήστη."
      });
      return;
    }

    setIsDeleting(true);

    try {
      // First get all listings IDs for this user
      const userListings = await db
        .select({ id: ProductListing.id })
        .from(ProductListing)
        .where(eq(ProductListing.createdBy, user.primaryEmailAddress.emailAddress));

      if (!userListings || userListings.length === 0) {
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Δεν υπάρχουν αγγελίες προς διαγραφή."
        });
        return;
      }

      const listingIds = userListings.map(listing => listing.id);

      // First delete all related images
      await db
        .delete(ProductImages)
        .where(inArray(ProductImages.ProductListingId, listingIds));

      // Then delete all listings
      await db
        .delete(ProductListing)
        .where(inArray(ProductListing.id, listingIds));

      toast({
        title: "Επιτυχής Διαγραφή",
        description: `${listingIds.length} αγγελίες διαγράφηκαν με επιτυχία.`
      });

      if (onDeleted) {
        onDeleted();
      }
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error("Failed to delete listings:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Παρουσιάστηκε σφάλμα κατά τη διαγραφή των αγγελιών."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="hover:scale-105 transition-all text-white font-light text-lg"
          disabled={isDeleting}
        >
          {isDeleting ? "Διαγραφή σε εξέλιξη..." : "Διαγραφή Όλων των Αγγελιών"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε σίγουροι ότι θέλετε να διαγράψετε όλες τις αγγελίες σας;
            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Διαγραφή σε εξέλιξη..." : "Διαγραφή Όλων"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllListingsButton;