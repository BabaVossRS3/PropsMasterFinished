import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { db } from './../../configs'
import ProductItem from './ProductItem'
import { ProductImages, ProductListing } from './../../configs/schema'
import { eq, desc } from 'drizzle-orm'
import { inArray } from 'drizzle-orm'

const MostSearched = () => {
    const [productList, setProductList] = useState([]);

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
            <div className="absolute top-2 left-2 z-10 flex gap-2 flex-wrap max-w-[calc(100%-16px)] pointer-events-none">
                <div className="bg-orange-500 px-3 py-1 rounded-full text-sm pb-1 text-white whitespace-nowrap">
                    {product?.typeoflist === 'Αγορά' ? 'Πώληση' : 'Ενοικίαση'}
                </div>
                
                {product?.userPlan && product.userPlan !== 'Basic' && (
                    <div className={`${getPlanBadgeStyle(product.userPlan)} px-3 py-1 rounded-full text-sm pb-1 text-white whitespace-nowrap`}>
                        {product.userPlan}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        GetPopularProductList();
    }, []);

    const GetPopularProductList = async () => {
        try {
            const result = await db
                .select({
                    id: ProductListing.id,
                    listingTitle: ProductListing.listingTitle,
                    typeoflist: ProductListing.typeoflist,
                    sellingPrice: ProductListing.sellingPrice,
                    negotiable: ProductListing.negotiable,
                    views: ProductListing.views,
                    userPlan: ProductListing.userPlan,
                    year: ProductListing.year,
                    category: ProductListing.category,
                    addressPosted: ProductListing.addressPosted
                })
                .from(ProductListing)
                .orderBy(desc(ProductListing.views))
                .limit(15);
    
            const productIds = result.map(product => product.id);
            
            const images = await db
                .select()
                .from(ProductImages)
                .where(inArray(ProductImages.ProductListingId, productIds));
    
            const productsWithImages = result.map(product => ({
                ...product,
                images: images.filter(img => img.ProductListingId === product.id)
            }));
    
            setProductList(productsWithImages);
        } catch (error) {
            console.error('Error fetching most viewed products:', error);
        }
    };

    if (!productList || productList.length === 0) {
        return (
            <div className='bg-white z-50 mx-4 sm:mx-24 mb-10 sm:mb-20'>
                <h2 className='font-light text-3xl text-center my-8 sm:my-16 text-[#B6A28E]'>
                    Δημοφιλή Προϊόντα
                </h2>
                <div className="text-center text-gray-700 animate-pulse">Αναμονή Νέων Αγγελιών...</div>
            </div>
        );
    }

    return (
        <div className='bg-white z-50 mx-4 sm:mx-24 mb-10 sm:mb-20'>
            <h2 className='font-light text-3xl text-center my-8 sm:my-16 text-[#B6A28E]'>
                Δημοφιλή Προϊόντα
            </h2>

            <Carousel className='relative mb-10 sm:mb-20'>
                <CarouselContent className='p-4 sm:p-10'>
                    {productList.map((item, index) => (
                        <CarouselItem 
                            key={index} 
                            className="w-full sm:basis-full md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                        >
                            <div className="relative">
                                {renderBadges(item)}
                                <ProductItem 
                                    product={{
                                        ...item,
                                        imageUrl: item.images?.imageUrl
                                    }} 
                                    key={index} 
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 sm:left-8 transform -translate-y-1/2 z-10" />
                <CarouselNext className="absolute top-1/2 right-4 sm:right-8 transform -translate-y-1/2 z-10" />
            </Carousel>
        </div>
    );
};

export default MostSearched;