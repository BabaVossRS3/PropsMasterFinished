import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const ProductViews = ({ productId, initialViews = 0 }) => {
  const [views, setViews] = useState(initialViews);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    // Check if this product has been viewed in this session
    const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '{}');
    
    if (!viewedProducts[productId]) {
      // Simulate API call to increment views
      const incrementViews = async () => {
        try {
          // In a real implementation, this would be your API endpoint
          // await fetch(`/api/products/${productId}/views`, { method: 'POST' });
          
          // Update local state
          setViews(prev => prev + 1);
          
          // Mark product as viewed in this session
          viewedProducts[productId] = true;
          localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
          setHasViewed(true);
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      };

      incrementViews();
    } else {
      setHasViewed(true);
    }
  }, [productId]);

  return (
    <div className="flex text-lg pt-5 items-center gap-2 text-gray-600">
      <Eye size={16} />
      <span className="">
        {views.toLocaleString()} {views === 1 ? 'Προβολή' : 'Προβολές'}
      </span>
    </div>
  );
};

export default ProductViews;