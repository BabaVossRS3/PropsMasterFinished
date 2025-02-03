import { Separator } from '@radix-ui/react-select';
import React from 'react';
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineSafetyCheck } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const ProductItem = ({ product, badges }) => {    
  return (
    <Link to={'/listing-details/' + product?.id}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative group max-w-sm mx-auto h-[450px]">
          {/* Badges Container */}
          <div className="absolute top-2 left-2 flex gap-1 z-20">
            {badges}
          </div>

          {/* Image Container with Overlay - Fixed Height */}
          <div className="relative w-full h-[180px] overflow-hidden">
            <img 
              src={product?.images[0]?.imageUrl} 
              alt="Product" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Container - Fixed Height */}
          <div className="p-3 sm:p-4 flex flex-col h-[270px]">
            {/* Title with fixed height */}
            <div className="h-14 flex items-center justify-center">
              <h2 className="text-base text-center font-semibold text-gray-800 line-clamp-2">
                {product?.listingTitle}
              </h2>
            </div>
            
            <Separator className="border-t border-gray-200 my-2" />
            
            {/* Info Grid with fixed height */}
            <div className="grid grid-cols-3 gap-2 h-24">
              <div className="flex flex-col justify-center items-center p-1 rounded-md bg-gray-50">
                <MdOutlineCategory className="text-lg text-orange-500 mb-1" />
                <span className="text-xs text-gray-600">Κατηγορία</span>
                <h2 className="text-center text-xs font-medium text-gray-800 line-clamp-1">
                  {product?.category || 'Άγνωστη Κατηγορία'}
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center p-1 rounded-md bg-gray-50">
                <MdOutlineSafetyCheck className="text-lg text-orange-500 mb-1" />
                <span className="text-xs text-gray-600">Χρονολογία</span>
                <h2 className="text-center text-xs font-medium text-gray-800">
                  {product?.year}
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center p-1 rounded-md bg-gray-50">
                <IoLocationOutline className="text-lg text-orange-500 mb-1" />
                <span className="text-xs text-gray-600">Περιοχή</span>
                <h2 className="text-center text-xs font-medium text-gray-800 line-clamp-1">
                  {product?.addressPosted}
                </h2>
              </div>
            </div>

            <Separator className="border-t border-gray-200 my-2" />
            
            {/* Price and Button Container - Push to bottom */}
            <div className="flex items-center justify-between gap-2 mt-auto">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:shadow group">
                <span>Περισσότερα</span>
                <IoOpenOutline className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <div className="text-lg font-bold text-gray-800">
                {product?.sellingPrice || 'Τιμή Μη Διαθέσιμη'}
                <span className="text-gray-500 pl-1">
                  {product?.typeoflist === 'Ενοικίαση' ? '€ /μέρα' : '€'}
                </span>
              </div>
              
              
            </div>
          </div>
        </div>
    </Link>
  );
}

export default ProductItem;