import { Separator } from '@radix-ui/react-select';
import React from 'react';
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineSafetyCheck } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const ProductItemAggelies = ({ product, badges }) => {    
    return (
      <Link to={'/listing-details/' + product?.id} className="block">
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full relative group max-w-sm mx-auto">
          {/* Badges Container */}
          <div className="absolute top-2 left-2 flex gap-1 z-20">
            {badges}
          </div>
          
          {/* Image Container with Overlay */}
          <div className="relative w-full overflow-hidden">
            <img 
              src={product?.images[0]?.imageUrl} 
              alt="Product" 
              className="w-full h-[180px] sm:h-[200px] object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-3 sm:p-4">
            {/* Listing Title */}
            <h2 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
              {product?.listingTitle}
            </h2>
            
            <Separator className="border-t border-gray-200 mb-3"/>
            
            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Category */}
              <div className="flex flex-col items-center p-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <MdOutlineCategory className="text-lg text-orange-500 mb-1" />
                <span className="text-xs text-gray-600">Κατηγορία</span>
                <h3 className="text-center text-xs font-medium text-gray-800 line-clamp-1">
                  {product?.category || 'Άγνωστη Κατηγορία'}
                </h3>
              </div>
              
              {/* Year */}
              <div className="flex flex-col items-center p-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <MdOutlineSafetyCheck className="text-lg text-orange-500 mb-1" />
                <span className="text-xs text-gray-600">Χρονολογία</span>
                <h3 className="text-center text-xs font-medium text-gray-800">
                  {product?.year}
                </h3>
              </div>
              
              {/* Location */}
              <div className="flex flex-col items-center p-1 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                <IoLocationOutline className="text-lg text-orange-500 mb-1" />
                <span className="text-xs text-gray-600">Περιοχή</span>
                <h3 className="text-center text-xs font-medium text-gray-800 line-clamp-1">
                  {product?.addressPosted}
                </h3>
              </div>
            </div>

            <Separator className="border-t border-gray-200 mb-3"/>
            
            {/* Price and Button Container */}
            <div className="flex items-center justify-between gap-2">
               {/* See More Button */}
               <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:shadow group">
                <span>Περισσότερα</span>
                <IoOpenOutline className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              {/* Price */}
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

export default ProductItemAggelies;