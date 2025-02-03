import React, { useState, useContext } from 'react';
import { CategoriesList } from '@/Shared/Data';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from './CategoriesContext';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const Category = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useContext(CategoryContext); // Use context to manage selected category
  const [isExpanded, setIsExpanded] = useState(false); // State to manage the expanded state

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName); // Update the selected category
    navigate('/aggelies'); // Navigate to the /aggelies page
    window.scrollTo(0, 0);
  };

  // Handle the button click to toggle expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-3">
      <h2 className="font-light text-3xl text-center mb-10 text-[#B6A28E]">
        Αναζήτηση Ανά Κατηγορίες
      </h2>

      {/* Wrapper for smooth height transition */}
      <div
        className={`overflow-y-auto transition-all duration-500 ease-in-out pb-5 ${
          isExpanded ? 'max-h-[9999px] border -border-b-2' : 'max-h-[300px] border -border-b-2'
        } md:border-0 sm:border sm:border-b-2 sm:border-t-0 `}
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 px-4 sm:px-6 md:px-10 lg:px-40">
          {CategoriesList.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className=" border rounded-md p-3 items-center flex flex-col justify-around text-center cursor-pointer hover:shadow-md hover:scale-105 transition-all h-[120px]"
            >
              <img
                src={category.icon}
                width={35}
                height={30}
                className="category-images"
              />
              <h2 className="mt-4 text-sm text-[#493628]">{category.name}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Button visible only on mobile */}
      
      <button
        onClick={toggleExpansion}
        className="block sm:hidden mt-5 mx-auto px-4 py-2 bg-transparent text-[#fcc178] font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-0"
      >
        {isExpanded ? (
          <span className="flex flex-col items-center justify-center">
            Σύρσιμο προς τα πάνω <IoIosArrowUp />
          </span>
        ) : (
          <span className="flex flex-col items-center justify-center">
            Εμφάνιση Όλων <IoIosArrowDown />
          </span>
        )}
      </button>

    </div>
  );
};

export default Category;
