import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const ProfilePictureUpload = ({ defaultImageUrl, uploading }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useUser();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Η εικόνα είναι πολύ μεγάλη. Μέγιστο μέγεθος: 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Παρακαλώ επιλέξτε μια εικόνα');
      return;
    }

    try {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Clerk
      await user.setProfileImage({ file });
      
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setPreviewUrl(null); // Reset preview on error
      alert('Υπήρξε πρόβλημα με την ενημέρωση της φωτογραφίας.');
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden relative">
        <img
          src={previewUrl || defaultImageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        {isHovering && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Camera className="text-white w-8 h-8" />
            </label>
          </div>
        )}
      </div>
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;