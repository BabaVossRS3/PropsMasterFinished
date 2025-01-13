
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
        <div className="text-[#242424] hover:scale-105 hover:shadow-md transition-all shadow-sm rounded-xl bg-[#f8f8f8] p-4 mx-auto max-w-xs sm:max-w-md h-auto">
          {/* Badges Container */}
          <div className="absolute m-4 flex gap-2">
            {badges}
          </div>

          <img 
            src={product?.images[0]?.imageUrl} 
            alt="Product" 
            className="rounded-t-xl h-[200px] sm:h-[250px] object-cover w-full mb-4 shadow-md"
          />

          <div className="p-2 sm:p-4">
            <h2 className="font-bold text-[#242424] text-xl sm:text-lg mb-2">{product?.listingTitle}</h2>
            <Separator className="border-t-2" />
            
            <div className="hidden sm:block sm:grid sm:grid-cols-3 pt-5 pb-5 h-auto gap-4">
              <div className="flex flex-col items-center">
                <MdOutlineCategory className="text-xl mb-2" />
                <h2 className="text-center"><span className="border-b border-solid pb-3">Κατηγορία</span><br /><br />{product?.category || 'Άγνωστη Κατηγορία'}</h2>
              </div>
              <div className="flex flex-col items-center">
                <MdOutlineSafetyCheck className="text-xl mb-2" />
                <h2 className="text-center"><span className="border-b border-solid pb-3">Χρονολογία</span><br /><br />{product?.year}</h2>
              </div>
              <div className="flex flex-col items-center">
                <IoLocationOutline className="text-xl mb-2" />
                <h2 className="text-center"><span className="border-b border-solid pb-3">Περιοχή</span><br /><br />{product?.addressPosted}</h2>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-center text-lg font-medium">
                {product?.sellingPrice || 'Τιμή Μη Διαθέσιμη'}
                {product?.typeoflist === 'Ενοικίαση' && '€ /μέρα'}
                {product?.typeoflist !== 'Ενοικίαση' && '€'}
              </h2>
              <div className="text-center mt-3">
                <h2 className="p-3 bg-orange-500 rounded text-white text-sm cursor-pointer hover:bg-orange-600 transition-all flex gap-1 items-center justify-center">      
                  Δείτε Περισσότερα <IoOpenOutline className="mx-1" />
                </h2>
              </div>
            </div>
          </div>
        </div>
    </Link>
  );
}

export default ProductItem;