
import React, { useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BsSearch } from "react-icons/bs";
import { CategoriesList, PriceSell } from '@/Shared/Data';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [typeoflist, setTypeOfList] = useState(searchParams.get('typeoflist') || '');
  const [price, setPrice] = useState(searchParams.get('price') || '');

  const handleSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Update or remove parameters based on selected values
    if (category) {
      newSearchParams.set('category', category);
    } else {
      newSearchParams.delete('category');
    }
    
    if (typeoflist) {
      newSearchParams.set('typeoflist', typeoflist);
    } else {
      newSearchParams.delete('typeoflist');
    }
    
    if (price) {
      newSearchParams.set('price', price);
    } else {
      newSearchParams.delete('price');
    }

    // Navigate to aggelies page with the updated params
    navigate(`/aggelies?${newSearchParams.toString()}`);
  };

  return (
    <div className="w-full md:w-[60%]">
      <div className="bg-white bg-opacity-90 rounded-sm sm:rounded-md">
        {/* Mobile Layout */}
        <div className="flex flex-col space-y-4 p-4 md:hidden">
          {/* Category Selector - Mobile */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Κατηγορία
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full border border-gray-200 rounded-lg p-3">
                <SelectValue placeholder="Επιλέξτε κατηγορία" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {CategoriesList.map((maker) => (
                  <SelectItem 
                    key={maker.id} 
                    value={maker.name}
                    className="p-3 hover:bg-gray-100"
                  >
                    {maker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type of Listing Selector - Mobile */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Τύπος Καταχώρησης
            </label>
            <Select value={typeoflist} onValueChange={setTypeOfList}>
              <SelectTrigger className="w-full border border-gray-200 rounded-lg p-3">
                <SelectValue placeholder="Αγορά/Ενοικίαση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Αγορά" className="p-3 hover:bg-gray-100">Αγορά</SelectItem>
                <SelectItem value="Ενοικίαση" className="p-3 hover:bg-gray-100">Ενοικίαση</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Selector - Mobile */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Τιμή
            </label>
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="w-full border border-gray-200 rounded-lg p-3">
                <SelectValue placeholder="Επιλέξτε εύρος τιμής" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {PriceSell.map((maker) => (
                  <SelectItem 
                    key={maker.id} 
                    value={maker.price}
                    className="p-3 hover:bg-gray-100"
                  >
                    {maker.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button - Mobile */}
          <button 
            onClick={handleSearch}
            className="w-full bg-primary text-white py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2"
          >
            <BsSearch className="text-xl" />
            <span>Αναζήτηση</span>
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-row gap-6 p-5 items-center justify-between">
          {/* Category Selector */}
          <div className="w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="outline-none border-none w-full shadow-none text-lg">
                <SelectValue placeholder="Κατηγορία" />
              </SelectTrigger>
              <SelectContent>
                {CategoriesList.map((maker, index) => (
                  <SelectItem key={`${maker.id}-${index}`} value={maker.name}>
                    {maker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-[40px] w-[1px] bg-gray-400" />

          {/* Type of Listing Selector */}
          <div className="w-auto">
            <Select value={typeoflist} onValueChange={setTypeOfList}>
              <SelectTrigger className="outline-none border-none w-full shadow-none text-lg">
                <SelectValue placeholder="Αγορά/Ενοικίαση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Αγορά">Αγορά</SelectItem>
                <SelectItem value="Ενοικίαση">Ενοικίαση</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-[40px] w-[1px] bg-gray-400" />

          {/* Price Selector */}
          <div className="w-auto">
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="outline-none border-none shadow-none text-lg">
                <SelectValue placeholder="Τιμή" />
              </SelectTrigger>
              <SelectContent>
                {PriceSell.map((maker, index) => (
                  <SelectItem key={`${maker.id}-${index}`} value={maker.price}>
                    {maker.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Icon */}
          <button
            onClick={handleSearch}
            className="flex justify-end w-[15%]"
          >
            <BsSearch className=" bg-transparent text-[40px] cursor-pointer rounded-full p-2 text-white searchIcon hover:scale-105 transition-all w-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;