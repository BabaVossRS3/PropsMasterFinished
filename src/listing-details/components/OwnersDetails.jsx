import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { Separator } from '@radix-ui/react-select';
import React from 'react'
import { Link } from 'react-router-dom';

const OwnersDetails = ({ productDetail }) => {
  return (
    <div className="p-10 border rounded-xl shadow-md mt-7">
      <h2 className="text-2xl mb-5">Πωλητής</h2>
      <div className="flex gap-5">
        <img
          src={productDetail && productDetail.userImageUrl ? productDetail?.userImageUrl : 'src/assets/freepik__background__18490.png'}
          className="w-[70px] h-[70px] rounded-full"
          alt="User Image"
        />

        <div>
          <h2 className="mt-2 font-medium text-xl text-[#242424]">{productDetail?.ownerName}</h2>
          <h2 className="text-gray-400">{productDetail?.createdBy}</h2>
        </div>
      </div>
      <Separator />
      <div className="flex gap-11 mt-5 items-center">
        <h2 className="text-2xl">Περιοχή:</h2>
        <div className="flex w-full flex-col gap-3">
          <h2 className="font-light text-xl text-[#242424]">
            {productDetail?.addressPosted}
          </h2>
          <div className="flex flex-col">
            <h4 className="font-light text-lg text-[#474646]">
              {productDetail?.municipality}
            </h4>
            <h4 className="font-light text-lg text-[#474646]">
              {productDetail?.zipCode}
            </h4>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex gap-6 mt-5 items-center">
        <h2 className="text-2xl">Τηλέφωνο:</h2>
        <h2 className="font-light text-xl">
          <a
            href={`tel:+${productDetail?.ownerTel}`}
            className="text-[#242424] hover:scale-105 hover:text-[#E78430] transition-all font-light no-underline"
          >
            {productDetail?.ownerTel}
          </a>
        </h2>
      </div>
      <div className="w-full items-center justify-center flex pt-5">
      <Link 
        to="/ReportUser"
        state={{ productDetail: productDetail }}
      >
        <Button className='bg-red-600 font-light hover:bg-red-400 hover:scale-105 transition-all'>
          Αναφορά
        </Button>
      </Link>
      </div>
    </div>
  );
};

export default OwnersDetails;