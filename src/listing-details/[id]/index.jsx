
import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import DetailHeader from '../components/detailHeader';
import { useParams } from 'react-router-dom';
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
  const [productDetail, setProductDetail] = useState();

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

  useEffect(() => {
    GetProductDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const GetProductDetail = async () => {
    try {
      // First, get the base product details
      const result = await db
        .select()
        .from(ProductListing)
        .innerJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
        .where(eq(ProductListing.id, id));

      console.log('Raw DB result:', result); // Debug log

      if (result && result.length > 0) {
        const resp = Service.FormatResult(result);
        console.log('Formatted result:', resp[0]); // Debug log
        
        // Get the current views count
        const viewsResult = await db
          .select({ views: ProductListing.views })
          .from(ProductListing)
          .where(eq(ProductListing.id, id))
          .execute();

        const currentViews = viewsResult[0]?.views || 0;
        
        // Set the product detail with views
        setProductDetail({
          ...resp[0],
          views: currentViews
        });

        // Increment views after getting product details
        await incrementViews(id);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="listingDetails-container">
        <div className="listingDetails-content">
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