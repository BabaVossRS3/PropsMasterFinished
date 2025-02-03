import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TopFilters = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(searchParams.get('typeoflist') || '');
  const [yearRange, setYearRange] = useState({
    min: '',
    max: ''
  });
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

    const year = searchParams.get('year');
    if (year) {
      const [min, max] = year.split('-').map(y => y.trim());
      setYearRange({ min: min || '', max: max || '' });
    }
  }, []);

  const handleTypeChange = (type) => {
    const newType = selectedType === type ? '' : type;
    setSelectedType(newType);
    updateSearchParams('typeoflist', newType);
  };

  const handleYearChange = (type, value) => {
    const newRange = { ...yearRange, [type]: value };
    setYearRange(newRange);
    
    if (newRange.min || newRange.max) {
      const yearString = `${newRange.min || ''}-${newRange.max || ''}`;
      updateSearchParams('year', yearString);
    } else {
      updateSearchParams('year', null);
    }
  };

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    
    if (newRange.min || newRange.max) {
      const priceString = `${newRange.min || '0'}-${newRange.max || '999999'}`;
      updateSearchParams('price', priceString);
    } else {
      updateSearchParams('price', null);
    }
  };

  const updateSearchParams = (param, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Remove the page parameter first (we'll add it back at the end)
    const currentPage = newSearchParams.get('page');
    newSearchParams.delete('page');
    
    // Update the filter parameter
    if (value) {
      newSearchParams.set(param, value);
    } else {
      newSearchParams.delete(param);
    }
    
    // Add page parameter last (always reset to 1 when filters change)
    newSearchParams.append('page', '1');
    
    // Navigate with the updated params
    navigate(`/aggelies?${newSearchParams.toString()}`, { replace: true });
  };

  const handleReset = () => {
    setSelectedType('');
    setYearRange({ min: '', max: '' });
    setPriceRange({ min: '', max: '' });
    // Navigate to base URL with page 1 (always at the end)
    const params = new URLSearchParams();
    params.append('page', '1');
    navigate(`/aggelies?${params.toString()}`, { replace: true });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedType !== '' || 
           yearRange.min !== '' || 
           yearRange.max !== '' || 
           priceRange.min !== '' || 
           priceRange.max !== '';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-col sm:flex-row">
        {/* Type of Listing Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-3">Τύπος Αγγελίας</h3>
          <div className="flex gap-4">
            {[
              { id: 'Αγορά', label: 'Πώληση' },
              { id: 'Ενοικίαση', label: 'Ενοικίαση' }
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`cursor-pointer flex items-center p-3 rounded-lg transition-colors flex-1 justify-center ${
                  selectedType === type.id
                    ? 'bg-[#f97216] text-white'
                    : 'hover:bg-orange-100 border border-gray-200'
                }`}
              >
                <div className={`w-4 h-4 border-2 rounded-full mr-2 flex items-center justify-center ${
                  selectedType === type.id ? 'border-white' : 'border-orange-500'
                }`}>
                  {selectedType === type.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span>{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Year Range Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-3">Χρονολογία</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Από</label>
              <input
                type="number"
                min="1500"
                max={new Date().getFullYear()}
                value={yearRange.min}
                onChange={(e) => handleYearChange('min', e.target.value)}
                placeholder="πχ. 1500"
                className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Έως</label>
              <input
                type="number"
                min="1500"
                max={new Date().getFullYear()}
                value={yearRange.max}
                onChange={(e) => handleYearChange('max', e.target.value)}
                placeholder="πχ. 2024"
                className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium mb-3">Εύρος Τιμής</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Ελάχιστη</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                placeholder="€"
                className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Μέγιστη</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                placeholder="€"
                className="w-full px-3 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reset Filters Button - With smooth animation */}
      <div className={`flex justify-center transition-all duration-300 ease-in-out ${hasActiveFilters() ? 'opacity-100 translate-y-0 h-10' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'}`}>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-[#f97216] hover:scale-105 transition-all text-gray-100 rounded-lg  duration-200 flex items-center gap-2"
        >
          Επαναφορά φίλτρων
        </button>
      </div>
    </div>
  );
};

export default TopFilters;