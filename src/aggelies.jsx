import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { CategoriesList } from './Shared/Data';
import { db } from './../configs';
import Service from '@/Shared/Service';
import { ProductListing, ProductImages } from './../configs/schema';
import { eq, and, sql } from 'drizzle-orm';
import ProductItemAggelies from './components/ProductItemAggelies';
import { CategoryContext } from './components/CategoriesContext';

const Aggelies = () => {
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const [searchParams] = useSearchParams();
  const [productList, setProductList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get filters from URL
  const categoryFromUrl = searchParams.get('category');
  const typeoflist = searchParams.get('typeoflist');
  const price = searchParams.get('price');

  // Set category from URL parameters or use context
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else if (!selectedCategory && CategoriesList.length > 0) {
      setSelectedCategory(CategoriesList[0].name);
    }
  }, [categoryFromUrl, selectedCategory, setSelectedCategory]);

  // Fetch products whenever selectedCategory, typeoflist, or price changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory, typeoflist, price]);

  // Helper function to get plan priority
  const getPlanPriority = (plan) => {
    switch (plan) {
      case 'Boost+':
        return 3;
      case 'Boost':
        return 2;
      default: // 'Basic' or any other plan
        return 1;
    }
  };

  // Fetch products based on filters
  const fetchProducts = async () => {
    try {
      let conditions = [eq(ProductListing.category, selectedCategory)];

      // Add typeoflist filter
      if (typeoflist) {
        conditions.push(eq(ProductListing.typeoflist, typeoflist));
      }

      // Add price filter
      if (price) {
        const priceRange = price.split('-');
        const minPrice = priceRange[0] ? parseInt(priceRange[0].trim()) : null;
        const maxPrice = priceRange[1] ? parseInt(priceRange[1].trim().replace('€', '').trim()) : null;

        if (minPrice !== null && maxPrice !== null) {
          conditions.push(sql`CAST(${ProductListing.sellingPrice} AS INTEGER) BETWEEN ${minPrice} AND ${maxPrice}`);
        } else if (minPrice !== null) {
          conditions.push(sql`CAST(${ProductListing.sellingPrice} AS INTEGER) >= ${minPrice}`);
        } else if (maxPrice !== null) {
          conditions.push(sql`CAST(${ProductListing.sellingPrice} AS INTEGER) <= ${maxPrice}`);
        }
      }

      const result = await db
        .select()
        .from(ProductListing)
        .innerJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
        .where(and(...conditions));

      const formattedResult = Service.FormatResult(result);
      
      // Sort the products based on plan priority
      const sortedProducts = formattedResult.sort((a, b) => {
        const planPriorityA = getPlanPriority(a.userPlan);
        const planPriorityB = getPlanPriority(b.userPlan);
        return planPriorityB - planPriorityA;
      });

      setProductList(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Render badges for the product
  const renderBadges = (product) => {
    const getPlanBadgeStyle = (plan) => {
      switch(plan) {
        case 'Boost+':
          return 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 font-dancing-script font-bold';
        case 'Boost':
          return 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-inter';
        default:
          return 'hidden';
      }
    };

    return (
      <>
        <h2 className="bg-orange-500 px-3 py-1 rounded-full text-sm pb-1 text-white">
          {product?.typeoflist === 'Αγορά' ? 'Πώληση' : 'Ενοικίαση'}
        </h2>
        
        {product?.userPlan && product.userPlan !== 'Basic' && (
          <h2 className={`${getPlanBadgeStyle(product.userPlan)} px-3 py-1 rounded-full text-sm pb-1 text-white`}>
            {product.userPlan}
          </h2>
        )}
      </>
    );
  };

  // Handle category click in the sidebar
  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
    setSidebarOpen(false);
  };

  return (
    <div className="aggelies-container">
      <Header />
      
      <div className="aggelies-main-content">
        <button
          className="mobile-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰ Κατηγορίες
        </button>

        {/* Sidebar */}
        <div className={`aggelies-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h2 className="aggelies-sidebar-title">Κατηγορίες</h2>
          <div className="aggelies-categories-list">
            {CategoriesList.map((category, index) => (
              <div
                key={index}
                className={`aggelies-category-item ${
                  selectedCategory === category.name ? 'aggelies-selected-category active-category' : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <img
                  className={`category-images aggelies-category-image ${
                    selectedCategory === category.name ? 'active-category' : 'text-[#fcc178]'
                  }`}
                  src={category.icon}
                  alt={category.name}
                />
                <h2 className="aggelies-category-name">{category.name}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Product Display */}
        <div className="aggelies-product-display">
          <h2 className="aggelies-category-title">
            {selectedCategory}
            {(typeoflist || price) && ' - Φιλτραρισμένα αποτελέσματα'}
          </h2>
          <div className="aggelies-product-grid">
            {productList?.length > 0 ? (
              productList.map((item, index) => (
                <div key={index}>
                  <ProductItemAggelies product={item} badges={renderBadges(item)} />
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((item, index) => (
                <div key={index} className="aggelies-placeholder"></div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Aggelies;