import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IoFilterOutline } from "react-icons/io5";
import { CategoryContext } from '@/components/CategoriesContext';
import dotsIcon from "/src/assets/dots.png";

const EnhancedSidebar = ({
  CategoriesList,
  sidebarOpen
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const [selectedType, setSelectedType] = useState(searchParams.get('typeoflist') || '');
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });

  useEffect(() => {
    const price = searchParams.get('price');
    if (price) {
      const [min, max] = price.split('-').map(p => p.replace('€', '').trim());
      setPriceRange({ min: min || '', max: max || '' });
    }
  }, []);

  // Create the "All" category object
  const allCategory = {
    name: 'Όλα',
    icon: dotsIcon
  };

  // Handle category selection with URL synchronization
  const handleCategorySelection = (category) => {
    if (selectedCategory !== category.name) {
      setSelectedCategory(category.name);
      
      // Update URL while preserving other parameters
      const newSearchParams = new URLSearchParams(searchParams);
      
      if (category.name === 'Όλα') {
        newSearchParams.delete('category');
      } else {
        newSearchParams.set('category', category.name);
      }
      
      // Navigate with updated URL
      navigate(`/aggelies?${newSearchParams.toString()}`, { replace: true });
    }
  };

  return (
    <aside className={`aggelies-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <h2 className="aggelies-sidebar-title">
        <IoFilterOutline className="inline-block mr-2" />
        Φίλτρα
      </h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Κατηγορίες</h3>
        <div className="aggelies-categories-list">
          {/* All Categories Button */}
          <div
            className={`aggelies-category-item ${
              selectedCategory === 'Όλα' ? 'aggelies-selected-category' : ''
            } ${selectedCategory === 'Όλα' ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => handleCategorySelection(allCategory)}
          >
            <img
              className={`aggelies-category-image ${
                selectedCategory === 'Όλα' ? 'active-category' : ''
              }`}
              src={allCategory.icon}
              alt="Όλα"
            />
            <h2 className="aggelies-category-name">Όλα</h2>
          </div>

          {/* Existing Categories */}
          {CategoriesList.map((category, index) => (
            <div
              key={index}
              className={`aggelies-category-item ${
                selectedCategory === category.name ? 'aggelies-selected-category' : ''
              } ${selectedCategory === category.name ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => handleCategorySelection(category)}
            >
              <img
                className={`aggelies-category-image ${
                  selectedCategory === category.name ? 'active-category' : ''
                }`}
                src={category.icon}
                alt={category.name}
              />
              <h2 className="aggelies-category-name">{category.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default EnhancedSidebar;