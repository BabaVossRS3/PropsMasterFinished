// import React from 'react'
// import { Textarea } from "@/components/ui/textarea"

// const TextAreaField = (item,handleInputChange) => {
//   return (
//     <div>
//       <Textarea onChange={(e)=>handleInputChange(item.name,e.target.value)}required={item?.required}/>
//     </div>
//   )
// }

// export default TextAreaField

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"

const TextAreaField = ({ plan, item, handleInputChange, productInfo }) => {
  const { toast } = useToast();
  const defaultMessage = "Ο Πωλητής δεν πρόσθεσε κάποια περιγραφή";
  
  // Track both the value and whether it's been modified
  const [value, setValue] = useState(productInfo?.[item.name] || "");
  const [hasBeenModified, setHasBeenModified] = useState(false);

  // Set the maxLength based on the plan
  let maxLength = 350; // Default for Boost
  if (plan === "Basic") {
    maxLength = 1500;
  } else if (plan === "Boost+") {
    maxLength = 1000;
  }

  // Handle input change and character limit validation
  const handleChange = (e) => {
    const newValue = e.target.value;
    setHasBeenModified(true);

    if (newValue.length <= maxLength) {
      setValue(newValue);
      // Only pass the actual value to parent, not the default message
      handleInputChange(item.name, newValue);
    } else {
      toast({
        variant: "destructive",
        title: `Όριο Χαρακτήρων ${maxLength}.`,
        description: `Η περιγραφή σας ξεπέρασε το όριο χαρακτήρων. Μπορείτε να καταχωρίσετε έως ${maxLength} χαρακτήρες.`,
      });
    }
  };

  // Calculate the display value based on state
  const displayValue = (!hasBeenModified && value.trim() === "") 
    ? defaultMessage 
    : value;

  // Update character count based on actual value, not display value
  const characterCount = value.length;

  return (
    <div>
      <Textarea
        onChange={handleChange}
        value={displayValue}
        maxLength={maxLength}
        placeholder="Γράψτε μια περιγραφή για το προϊόν..."
        onFocus={() => {
          // Clear default message on focus if it hasn't been modified
          if (!hasBeenModified && displayValue === defaultMessage) {
            setValue("");
          }
        }}
      />
      <div className="text-right text-sm text-gray-500">
        {characterCount}/{maxLength} χαρακτήρες
      </div>
    </div>
  );
};

export default TextAreaField;