
import { Separator } from '@radix-ui/react-select';
import React from 'react';
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineSafetyCheck } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { IoOpenOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const ProductItemAggelies = ({ product, badges }) => {    
    return (
      <Link to={'/listing-details/' + product?.id}>
        <div className="product-item-aggelies relative">
          {/* Badges Container - Moved above the sale/rent badge and adjusted z-index */}
          <div className="absolute top-4 left-4  flex gap-2 z-20">
            {badges}
          </div>
          
          {/* Image */}
          <img 
            src={product?.images[0]?.imageUrl} 
            alt="Product" 
            className="rounded-t-xl h-[200px] sm:h-[250px] object-cover w-full mb-4 shadow-md"
          />
          
          <div className="right-side-aggelies p-4">
            {/* Listing Title */}
            <h2 className='title-h2'>{product?.listingTitle}</h2>
            <Separator className='border-t-2'/>
            
            <div className="content">
              {/* Category */}
              <div className="content-category">
                <MdOutlineCategory className='text-l mb-2' />
                <h2 className='text-center'>
                  <span className='border-b border-solid pb-3'>Κατηγορία</span>
                  <br/><br/>{product?.category || 'Άγνωστη Κατηγορία'}
                </h2>
              </div>
              {/* Year */}
              <div className="content-category">
                <MdOutlineSafetyCheck className='text-l mb-2' />
                <h2 className='text-center'>
                  <span className='border-b border-solid pb-3'>Χρονολογία</span>
                  <br/><br/>{product?.year}
                </h2>
              </div>
              {/* Address */}
              <div className="content-category">
                <IoLocationOutline className='text-l mb-2' />
                <h2 className='text-center'>
                  <span className='border-b border-solid pb-3'>Περιοχή</span>
                  <br/><br/>{product?.addressPosted}
                </h2>
              </div>
            </div>
            <Separator className='border-t-2 my-2'/>
            
            <div className="button-div-price-aggelies gap-10">
              {/* Price */}
              <h2 className="text-center text-[#242424] p-3">
                {product?.sellingPrice || 'Τιμή Μη Διαθέσιμη'}
                {product?.typeoflist === 'Ενοικίαση' && '€ /μέρα'}
                {product?.typeoflist !== 'Ενοικίαση' && '€'}
              </h2>
              
              {/* See More Button */}
              <h2 className='p-2 bg-orange-500 rounded text-white flex gap-1 items-center text-sm cursor-pointer hover:scale-105 transition-all'>      
                Δείτε Περισσότερα <IoOpenOutline className='mx-1'/>
              </h2>
            </div>
          </div>
        </div>
      </Link>
    );
}

export default ProductItemAggelies;