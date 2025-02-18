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
import Service from '@/Shared/Service'

const PromotedProducts = () => {
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
                    {product?.typeoflist === 'Αγορά' ? 'Πώληση' : 
                    product?.typeoflist === 'Χαρίζεται' ? 'Χαρίζεται' : 
                    'Ενοικίαση'}
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
        getPromotedProducts();
    }, []);

    const getPromotedProducts = async () => {
        try {
            const result = await db
                .select()
                .from(ProductListing)
                .leftJoin(
                    ProductImages,
                    eq(ProductListing.id, ProductImages.ProductListingId)
                )
                .execute();

            const formattedResults = Service.FormatResult(result);

            const sortByPlan = (a, b) => {
                const planPriority = {
                    'Boost+': 3,
                    'Boost': 2,
                    'Basic': 1
                };

                const planA = planPriority[a.userPlan] || 0;
                const planB = planPriority[b.userPlan] || 0;

                if (planA !== planB) {
                    return planB - planA;
                }

                return b.id - a.id;
            };

            const sortedProducts = formattedResults.sort(sortByPlan);
            setProductList(sortedProducts.slice(0, 15));
        } catch (error) {
            console.error('Error fetching promoted products:', error);
        }
    };

    if (!productList || productList.length === 0) {
        return (
            <div className='bg-white z-50 mx-4 sm:mx-24 mb-10 sm:mb-20'>
                <h2 className='font-light text-3xl text-center my-8 sm:my-16 text-[#B6A28E]'>
                    Προωθημένα Προϊόντα
                </h2>
                <div className="text-center text-gray-700 animate-pulse">Αναμονή Νέων Αγγελιών...</div>
            </div>
        );
    }

    return (
        <div className='bg-white z-50 mx-4 sm:mx-24 mb-10 sm:mb-20'>
            <h2 className='font-light text-3xl text-center my-8 sm:my-16 text-[#B6A28E]'>
                Προωθημένα Προϊόντα
            </h2>

            <Carousel className='relative mb-10 sm:mb-20'>
                <CarouselContent className='p-4 sm:p-10'>
                    {productList.map((item, index) => (
                        <CarouselItem 
                            key={index} 
                            className="w-full sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        >
                            <div className="relative">
                                {renderBadges(item)}
                                <ProductItem 
                                    product={item}
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

export default PromotedProducts;