import React from 'react';
import { Separator } from '@radix-ui/react-select';
import { PiHammer } from "react-icons/pi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { SiMaterialformkdocs } from "react-icons/si";
import { IoIosColorFill } from "react-icons/io";

const DetailHeader = ({ productDetail }) => {
  return (
    <div className="py-6">
      {productDetail?.listingTitle ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              {productDetail?.listingTitle}
            </h2>
            <Separator className="h-px w-32 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-70" />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { Icon: MdOutlineCalendarMonth, value: productDetail?.year },
              { Icon: PiHammer, value: productDetail?.condition },
              { Icon: SiMaterialformkdocs, value: productDetail?.material },
              { Icon: IoIosColorFill, value: productDetail?.color }
            ].map(({ Icon, value }, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-primary 
                          transition-all duration-300 hover:bg-orange-200 hover:shadow-md"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-24 bg-orange-100 rounded-xl animate-pulse" />
      )}
    </div>
  );
};

export default DetailHeader;