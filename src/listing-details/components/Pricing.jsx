// import { Button } from '@/components/ui/button'
// import React from 'react'
// import { FaMessage } from "react-icons/fa6";


// const Pricing = ({productDetail}) => {
//     console.log(productDetail?.negotiable); // Add this for debugging

//   return (
//     <div className='p-10 rounded-xl border shadow-md '>
//         {productDetail ? (
//     <>
//         <h2 className="text-3xl">Τιμή</h2>
//         <h2 className="text-[#242424] text-4xl pt-4 w-full font-bold">
//             {productDetail.sellingPrice} €
//             {productDetail?.typeoflist === 'Ενοικίαση' && (
//                 <span className="text-gray-500 text-lg font-light"> /μέρα</span>
//             )}
//         </h2>


//         {productDetail.negotiable === "Nαί" && (
//             <h2 className="text-xl text-gray-400 pt-4">Συζητήσιμη</h2>
//         )}

//     </>
// ) : (
//     <div className="w-full h-[200px] rounded-xl bg-orange-100 animate-pulse"></div>
// )}

//     </div>
//   )
// }

// export default Pricing
import { Button } from '@/components/ui/button'
import React from 'react'
import { FaMessage } from "react-icons/fa6";
import ProductViews from '@/components/ProductViews'; // Make sure to adjust the import path

// const Pricing = ({productDetail}) => {

//     return (
//         <div className='p-10 rounded-xl border shadow-md '>
//             {productDetail ? (
//                 <>
//                     <h2 className="text-3xl">Τιμή</h2>
//                     <h2 className="text-[#242424] text-4xl pt-4 w-full font-bold">
//                         {productDetail.sellingPrice} €
//                         {productDetail?.typeoflist === 'Ενοικίαση' && (
//                             <span className="text-gray-500 text-lg font-light"> /μέρα</span>
//                         )}
//                     </h2>

//                     {productDetail.negotiable === "Nαί" && (
//                         <h2 className="text-xl text-gray-400 pt-4">Συζητήσιμη</h2>
//                     )}

//                     <ProductViews 
//                         productId={productDetail.id} 
//                         initialViews={productDetail.views || 0}
//                     />
//                 </>
//             ) : (
//                 <div className="w-full h-[200px] rounded-xl bg-orange-100 animate-pulse"></div>
//             )}
//         </div>
//     )
// }

// export default Pricing


const Pricing = ({productDetail}) => {
    const renderPlanBadge = (product) => {
        if (!product || !product.userPlan || product.userPlan === 'Basic') return null;

        const getPlanBadgeStyle = (plan) => {
            return plan === 'Boost+' ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 font-dancing-script text-2xl font-bold' : 'text-lg font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-inter text-2xl';
        };

        return (
            <div className="flex justify-end">
                <h2 className={`${getPlanBadgeStyle(product.userPlan)} px-4 py-2 rounded-full text-white text-center shadow-sm`}>
                    {product.userPlan}
                </h2>
            </div>
        );
    };

    return (
        <div className='p-10 rounded-xl border shadow-md'>
            {productDetail ? (
                <div className="flex justify-between items-start gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                        <h2 className="text-3xl">Τιμή</h2>
                        <h2 className="text-[#242424] text-4xl pt-4 w-full font-bold">
                            {productDetail.sellingPrice} €
                            {productDetail?.typeoflist === 'Ενοικίαση' && (
                                <span className="text-gray-500 text-lg font-light"> /μέρα</span>
                            )}
                        </h2>

                        {productDetail.negotiable === "Nαί" && (
                            <h2 className="text-xl text-gray-400 pt-4">Συζητήσιμη</h2>
                        )}

                        <ProductViews
                            productId={productDetail.id}
                            initialViews={productDetail.views || 0}
                        />
                    </div>

                    {/* Right Section - Plan Badge Only */}
                    <div className="min-w-[120px]">
                        {renderPlanBadge(productDetail)}
                    </div>
                </div>
            ) : (
                <div className="w-full h-[200px] rounded-xl bg-orange-100 animate-pulse"></div>
            )}
        </div>
    );
}

export default Pricing;