import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import DetailHeader from '../components/detailHeader';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ProductImages, ProductListing } from './../../../configs/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import Service from '@/Shared/Service';
import { db } from './../../../configs';
import ImageGallery from '../components/ImageGallery';
import Description from '../components/Description';
import Pricing from '../components/Pricing';
import Specification from '../components/Specification';
import OwnersDetails from '../components/OwnersDetails';
import Footer from '@/components/Footer';
import MostSearched from '@/components/MostSearched';
import PromotedProducts from '@/components/PromotedProducts';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [productDetail, setProductDetail] = useState();

  // The previous location should be available in location.state
  const previousLocation = location.state?.from;

  useEffect(() => {
    GetProductDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const incrementViews = async (productId) => {
    try {
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '{}');
      
      if (!viewedProducts[productId]) {
        await db
          .update(ProductListing)
          .set({ 
            views: sql`COALESCE(${ProductListing.views}, 0) + 1`
          })
          .where(eq(ProductListing.id, productId));

        viewedProducts[productId] = true;
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const GetProductDetail = async () => {
    try {
      const result = await db
        .select()
        .from(ProductListing)
        .innerJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
        .where(eq(ProductListing.id, id));

      if (result && result.length > 0) {
        const resp = Service.FormatResult(result);
        
        const viewsResult = await db
          .select({ views: ProductListing.views })
          .from(ProductListing)
          .where(eq(ProductListing.id, id))
          .execute();

        const currentViews = viewsResult[0]?.views || 0;
        
        setProductDetail({
          ...resp[0],
          views: currentViews
        });

        await incrementViews(id);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleBack = () => {
    if (previousLocation) {
      navigate(previousLocation.pathname + previousLocation.search);
    } else {
      navigate('/aggelies');
    }
  };

  return (
    <>
      <Header />
      <div className="listingDetails-container">
        <div className="listingDetails-content">
          <button 
            onClick={handleBack}
            className="back-button px-4 py-2 bg-transparent items-center flex mb-4 text-lg font-medium text-gray-700 hover:text-gray-900"
          >
            ←Πίσω
          </button>
          <DetailHeader productDetail={productDetail} />
          <div className="listingDetails-grid">
            {/* Left Section */}
            <div className="listingDetails-left">
              <ImageGallery productDetail={productDetail} />
              <Description productDetail={productDetail} />
            </div>
            {/* Right Section */}
            <div className="listingDetails-right">
              <Pricing productDetail={productDetail} />
              <Specification productDetail={productDetail} />
              <OwnersDetails productDetail={productDetail} />
            </div>
          </div>
          <PromotedProducts/>
          <MostSearched />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetail;