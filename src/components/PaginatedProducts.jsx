import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductItemAggelies from './ProductItemAggelies';

const PaginatedProducts = ({ productList, loading, itemsPerPage = 15, renderBadges, selectedCategory }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when any filter changes (including category)
  useEffect(() => {
    // Get current URL params
    const params = new URLSearchParams(searchParams);
    // Force page to 1
    params.set('page', '1');
    // Update URL and state
    navigate(`?${params.toString()}`, { replace: true });
    setCurrentPage(1);
  }, [selectedCategory]); // Add other filter dependencies here

  // Calculate pagination values
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    navigate(`?${params.toString()}`);
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pagination with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div>
      <div className="aggelies-product-grid">
        {loading ? (
          Array(8).fill(null).map((_, index) => (
            <div key={index} className="aggelies-placeholder animate-pulse" />
          ))
        ) : currentItems?.length > 0 ? (
          currentItems.map((item, index) => (
            <div key={index} className="transform transition-transform duration-200 hover:translate-y-[-4px]">
              <ProductItemAggelies product={item} badges={renderBadges(item)} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            Δεν βρέθηκαν προϊόντα σε αυτήν την κατηγορία
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Προηγούμενη
          </button>
          
          {getPageNumbers().map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-4 py-2">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Επόμενη
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedProducts;