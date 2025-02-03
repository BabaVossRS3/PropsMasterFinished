  import React, { useState, useEffect, useContext } from 'react';
  import { useSearchParams, useNavigate } from 'react-router-dom';
  import Header from './components/Header';
  import Footer from './components/Footer';
  import { CategoriesList } from './Shared/Data';
  import { db } from './../configs';
  import Service from '@/Shared/Service';
  import { ProductListing, ProductImages } from './../configs/schema';
  import { eq, and, sql } from 'drizzle-orm';
  import ProductItemAggelies from './components/ProductItemAggelies';
  import { CategoryContext } from './components/CategoriesContext';
  import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
  import EnhancedSidebar from './components/EnhancedSidebar';
  import TopFilters from './components/TopFilters';
  import PaginatedProducts from './components/PaginatedProducts';
  import MobileControls from './components/MobileControls';
  
  const Aggelies = () => {
    const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [productList, setProductList] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
  
    // Get filters from URL
    const categoryFromUrl = searchParams.get('category');
    const typeoflist = searchParams.get('typeoflist');
    const price = searchParams.get('price');
    const year = searchParams.get('year');


  
    useEffect(() => {
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
      }
    }, [categoryFromUrl, setSelectedCategory]);
  
    useEffect(() => {
      setLoading(true);
      fetchProducts().finally(() => setLoading(false));
    }, [selectedCategory, typeoflist, price , year]);
  
    const getPlanPriority = (plan) => {
      const priorities = { 'Boost+': 3, 'Boost': 2, 'Basic': 1 };
      return priorities[plan] || 1;
    };
  
    const fetchProducts = async () => {
      try {
        let conditions = [];
        
        // Only add category condition if not "Όλα" and category is selected
        if (selectedCategory && selectedCategory !== 'Όλα') {
          conditions.push(eq(ProductListing.category, selectedCategory));
        }
  
        if (typeoflist) {
          conditions.push(eq(ProductListing.typeoflist, typeoflist));
        }
  
        if (price) {
          const [minPrice, maxPrice] = price.split('-').map(p => 
            p ? parseInt(p.replace('€', '').trim()) : null
          );
  
          if (minPrice && maxPrice) {
            conditions.push(sql`CAST(${ProductListing.sellingPrice} AS INTEGER) BETWEEN ${minPrice} AND ${maxPrice}`);
          } else if (minPrice) {
            conditions.push(sql`CAST(${ProductListing.sellingPrice} AS INTEGER) >= ${minPrice}`);
          } else if (maxPrice) {
            conditions.push(sql`CAST(${ProductListing.sellingPrice} AS INTEGER) <= ${maxPrice}`);
          }
        }
        if (year) {
          const [minYear, maxYear] = year.split('-').map(y => y.trim());
          
          if (minYear && maxYear) {
            conditions.push(sql`CAST(${ProductListing.year} AS INTEGER) BETWEEN ${minYear} AND ${maxYear}`);
          } else if (minYear) {
            conditions.push(sql`CAST(${ProductListing.year} AS INTEGER) >= ${minYear}`);
          } else if (maxYear) {
            conditions.push(sql`CAST(${ProductListing.year} AS INTEGER) <= ${maxYear}`);
          }
        }
  
        const query = db
          .select()
          .from(ProductListing)
          .innerJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId));
  
        // Only add WHERE clause if there are conditions
        if (conditions.length > 0) {
          query.where(and(...conditions));
        }
  
        const result = await query;
  
        const formattedResult = Service.FormatResult(result);
        const sortedProducts = formattedResult.sort((a, b) => 
          getPlanPriority(b.userPlan) - getPlanPriority(a.userPlan)
        );
  
        setProductList(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    const renderBadges = (product) => {
      const planBadgeStyles = {
        'Boost+': 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 font-dancing-script font-bold',
        'Boost': 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-inter',
        'Basic': 'hidden'
      };
  
      return (
        <>
          <h2 className="bg-orange-500 px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm">
            {product?.typeoflist === 'Αγορά' ? 'Πώληση' : 'Ενοικίαση'}
          </h2>
          
          {product?.userPlan && product.userPlan !== 'Basic' && (
            <h2 className={`${planBadgeStyles[product.userPlan]} px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm`}>
              {product.userPlan}
            </h2>
          )}
        </>
      );
    };

    return (
      <div className="aggelies-container">
        <Header />

        {/* Mobile Sidebar */}
        <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <EnhancedSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory} // Pass the setter function
          CategoriesList={CategoriesList}
          sidebarOpen={true}
        />
        </div>

        {/* Mobile Filters Panel */}
        <div className={`mobile-filters ${filterOpen ? 'open' : ''}`}>
          <div className="mobile-filters-header">
            <h3 className="mobile-filters-title">Φίλτρα</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setFilterOpen(false)}
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          <div className="mobile-filters-content">
            <TopFilters />
          </div>
        </div>

        <div className="aggelies-main-content">
          {/* Desktop Sidebar */}
          <div className="sidebar">
          <EnhancedSidebar
              selectedCategory={selectedCategory}
              CategoriesList={CategoriesList}
              sidebarOpen={true}
            />
          </div>

          <main className="aggelies-product-display">
            {/* Desktop Filters */}
            <div className="desktop-filters">
              <TopFilters />
            </div>
            
            {/* Mobile Controls */}
            <div className="mobile-view-controls">
              <MobileControls 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              />
            </div>

            <h2 className="aggelies-category-title">
              {selectedCategory}
              {(typeoflist || price || year) && 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Φιλτραρισμένα αποτελέσματα)
                </span>
              }
            </h2>

            <PaginatedProducts 
              productList={productList}
              loading={loading}
              itemsPerPage={9}
              renderBadges={renderBadges}
              selectedCategory={selectedCategory}
            />
          </main>
        </div>

        {/* Backdrop */}
        <div 
          className={`modal-backdrop ${sidebarOpen || filterOpen ? 'open' : ''}`}
          onClick={() => {
            setSidebarOpen(false);
            setFilterOpen(false);
          }}
        />
        
        <Footer />
      </div>
    );
  };
  
  export default Aggelies;
  