import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from './CategoriesContext';
import { CategoriesList } from '@/Shared/Data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from './../styles/Category.module.css'
const Category = () => {
  const navigate = useNavigate();
  const { setSelectedCategory } = useContext(CategoryContext);
  
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate('/aggelies');
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-40 mt-3">
      <h2 className="font-light text-3xl text-center mb-10 text-[#B6A28E]">
        Αναζήτηση Ανά Κατηγορίες
      </h2>

      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {CategoriesList.map((category, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/4 lg:basis-1/6">
              <div 
                className={`${styles.categoryCard} h-32 cursor-pointer`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className={`${styles.iconWrapper} mb-4 w-10 h-10 flex items-center justify-center`}>
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h2 className="text-sm text-[#493628] text-center">
                    {category.name}
                  </h2>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default Category;