// import React from 'react'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"


// const DropdownField= ({item,handleInputChange,productInfo}) => {
//   return (
//     <div>
//       <Select
//         onValueChange={(value) => handleInputChange(item.name, value)}
//         required={item?.required}
//         defaultValue={productInfo?.[item?.name]}
//       >
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder={productInfo?.[item?.name] || item?.label} />
//         </SelectTrigger>
//         <SelectContent>
//           {item?.options?.map((option, index) => (
//             <SelectItem key={index} value={option}>
//               {option}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
  
// }

// export default DropdownField

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import municipalityData from '@/Shared/municipalityMapping.json'

const DropdownField = ({item, handleInputChange, productInfo, formData}) => {
  const [options, setOptions] = useState(item?.options || []);

  useEffect(() => {
    if (item.name === 'municipality') {
      const selectedRegion = formData?.addressPosted;
      
      if (selectedRegion && municipalityData.municipalityMapping[selectedRegion]) {
        // If a region is selected, use its municipalities
        setOptions(municipalityData.municipalityMapping[selectedRegion].municipalities);
      } else {
        // If no region is selected, show default message
        setOptions([municipalityData.defaultMunicipality]);
      }

      // Reset municipality value if the region changes and current selection is invalid
      if (productInfo?.[item.name] && 
          selectedRegion && 
          !municipalityData.municipalityMapping[selectedRegion]?.municipalities.includes(productInfo[item.name])) {
        handleInputChange(item.name, '');
      }
    }
  }, [formData?.addressPosted, item.name]);

  return (
    <div>
      <Select
        onValueChange={(value) => handleInputChange(item.name, value)}
        required={item?.required}
        defaultValue={productInfo?.[item?.name]}
        disabled={item.name === 'municipality' && !formData?.addressPosted}
      >
        <SelectTrigger className="w-full">
          <SelectValue 
            placeholder={
              item.name === 'municipality' && !formData?.addressPosted 
                ? municipalityData.defaultMunicipality 
                : (productInfo?.[item?.name] || item?.label)
            } 
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropdownField