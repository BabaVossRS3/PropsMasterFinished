  import Header from '@/components/Header'
  import Search from '@/components/Search'
  import { ProductImages, ProductListing } from './../../../configs/schema'
  import { eq } from 'drizzle-orm'
  import React, { useEffect, useState } from 'react'
  import { useParams } from 'react-router-dom'
  import { db } from './../../../configs'
  import Service from '@/Shared/Service'
  import ProductItem from '@/components/ProductItem'
  import Footer from '@/components/Footer'
  import { Separator } from '@radix-ui/react-select'


  // const SearchByCategory = () => {

  //     const {category}=useParams();
  //     const [productList,setProductList] = useState([]);

  //     useEffect(()=>{
  //         GetProductList();
  //     },[])

  //     const GetProductList= async()=>{
  //         const result = await db.select().from(ProductListing).innerJoin(ProductImages,eq(ProductListing.id,ProductImages.ProductListingId)).where(eq(ProductListing.category,category))

  //         const resp = Service.FormatResult(result);
  //         setProductList(resp);
  //     }

  //   return (
  //     <div>
  //       <Header/>

  //       <div className="p-16 bg-[#e38434] flex justify-center">
  //         <Search/>
  //       </div>
  //       <div className="p-10 md:pt-20">
  //         <h2 className='font-light text-4xl pb-6 '>{category}</h2>
  //         <Separator className='flex justify-center h-[1px] w-1/3 ml-10 bg-gradient-to-r from-transparent via-[#e38434] to-transparent)' />
  //         {/* lista kathgoriwn */}
  //         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10 mt-7">
  //           {productList?.length>0? productList.map((item,index)=>(
  //             <div key={index}>
  //               <ProductItem product={item}/>
  //             </div>
  //           )):
  //             [1,2,3,4].map((item,index)=>(
  //               <div className="h-[400px] rounded-xl bg-slate-200 animate-pulse">

  //               </div>
  //             ))
  //           }
  //         </div>
  //       </div>

  //       <Footer/>
  //     </div>

      
  //   )
  // }

  // export default SearchByCategory
  const SearchByCategory = () => {
    const {category} = useParams();
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        GetProductList();
    }, [category])

    const GetProductList = async () => {
        // Get products for this category
        const result = await db
            .select()
            .from(ProductListing)
            .innerJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
            .where(eq(ProductListing.category, category));

        const resp = Service.FormatResult(result);
        
        // Sort products by plan priority
        const sortedProducts = resp.sort((a, b) => {
            const planPriority = {
                'Boost+': 3,
                'Boost': 2,
                'Basic': 1
            };

            const planA = planPriority[a.userPlan] || 0;
            const planB = planPriority[b.userPlan] || 0;

            if (planA !== planB) {
                return planB - planA; // Higher priority first
            }

            // If same plan, sort by newest (assuming id is auto-incrementing)
            return b.id - a.id;
        });

        setProductList(sortedProducts);
    };

    const renderBadges = (product) => {
        return (
            <>
                <h2 className="bg-orange-500 px-3 py-1 rounded-full text-sm pb-1 text-white">
                    {product?.typeoflist === 'Αγορά' ? 'Πώληση' : 'Ενοικίαση'}
                </h2>
                
                {product?.userPlan && product.userPlan !== 'Basic' && (
                    <h2 className={`${
                        product.userPlan === 'Boost+' ? 'bg-purple-500' : 'bg-blue-500'
                    } px-3 py-1 rounded-full text-sm pb-1 text-white`}>
                        {product.userPlan}
                    </h2>
                )}
            </>
        );
    };

    return (
        <div>
            <Header/>
            <div className="p-16 bg-[#e38434] flex justify-center">
                <Search/>
            </div>
            <div className="p-10 md:pt-20">
                <h2 className='font-light text-4xl pb-6'>{category}</h2>
                <Separator className='flex justify-center h-[1px] w-1/3 ml-10 bg-gradient-to-r from-transparent via-[#e38434] to-transparent)' />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-10 mt-7">
                    {productList?.length > 0 ? productList.map((item, index) => (
                        <div key={index}>
                            <ProductItem 
                                product={item}
                                badges={renderBadges(item)}
                            />
                        </div>
                    )) :
                        [1, 2, 3, 4].map((item, index) => (
                            <div key={index} className="h-[400px] rounded-xl bg-slate-200 animate-pulse">
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default SearchByCategory;