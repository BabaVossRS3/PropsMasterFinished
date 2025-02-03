import Header from '@/components/Header'
import React, { useEffect, useState } from 'react'
import productDetails from '@/Shared/productDetails.json'
import InputField from './components/InputField'
import DropdownField from './components/DropdownField'
import TextAreaField from './components/TextAreaField'
import { Button } from '@/components/ui/button'
import { db } from '../../configs'
import { ProductImages, ProductListing } from '../../configs/schema'
import IconField from './components/IconField'
import UploadImages from './components/UploadImages'
import { Separator } from '@radix-ui/react-select'
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate, useSearchParams} from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"
import { useUser } from '@clerk/clerk-react'
import { use } from 'react'
import moment from 'moment';
import { eq } from 'drizzle-orm'
import Service from '@/Shared/Service'
import CheckboxField from './components/CheckboxField'
import features from './../Shared/features.json'
import { Checkbox } from '@radix-ui/react-checkbox'



const BoostListing = () => {
  const [formData, setFormData] = useState([]);
  const [hasImages, setHasImages] = useState(false);
  const [triggerUploadImages, setTriggerUploadImages] = useState();
  const [searchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [productInfo, setProductInfo] = useState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  const mode = searchParams.get("mode");
  const recordId = searchParams.get("id");

  useEffect(() => {
    if (mode === "edit") {
      GetListingDetail();
    }
  }, []);

  const GetListingDetail = async () => {
    const result = await db
      .select()
      .from(ProductListing)
      .innerJoin(ProductImages, eq(ProductListing.id, ProductImages.ProductListingId))
      .where(eq(ProductListing.id, recordId));

    const resp = Service.FormatResult(result);
    setProductInfo(resp[0]);
    setFormData(resp[0]);
    console.log(resp);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log("Form data being sent:", formData);

  const onSubmit = async (e) => {
    console.log("Data being sent to the backend:", formData);

    setLoader(true);
    e.preventDefault();
    if (!hasImages && mode !== 'edit') {
      toast({
          variant: "destructive",
          title: "Απαιτείται Φωτογραφία",
          description: "Παρακαλώ ανεβάστε τουλάχιστον μία φωτογραφία για την αγγελία σας.",
      });
      setLoader(false);
      return;
    }
    toast({
      title: "Παρακαλώ Περιμένετε...",
      description: "Η Αγγελία σας ανεβαίνει",
    });

    // Add the user plan to the form data as 'Boost'
    const formDataWithPlan = {
      ...formData,
      userPlan: "Boost", // Add the user plan with 'Boost' value
      createdBy: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      clerkUserId: user.id,
      userImageUrl: user?.imageUrl,
      postedOn: moment().format("DD/MM/YYYY"),
    };

    if (mode === "edit") {
      const result = await db
        .update(ProductListing)
        .set(formDataWithPlan)
        .where(eq(ProductListing.id, recordId))
        .returning({ id: ProductListing.id });

      navigate("/profile");
      setLoader(false);

      if (result) {
        console.log("Data Saved");
        setTriggerUploadImages(result[0]?.id);
        setLoader(false);
        toast({
          title: "Η Αγγελία σας Ανέβηκε επιτυχώς",
          className: "bg-green-500 text-white",
          duration: 5000,
        });
      }
    } else {
      try {
        const result = await db
          .insert(ProductListing)
          .values(formDataWithPlan)
          .returning({ id: ProductListing.id });

        if (result) {
          console.log("Data Saved");
          setTriggerUploadImages(result[0]?.id);
          setLoader(false);
          toast({
            title: "Η Αγγελία σας Ανέβηκε επιτυχώς",
            className: "bg-green-500 text-white",
          });
        }
      } catch (e) {
        console.log("Error", e);
        toast({
          variant: "destructive",
          title: "Κάτι Πήγε στραβά",
          description: "Παρακαλώ συμπληρώστε όλα τα πεδία με τα σωστά τους στοιχεία",
        });
        setLoader(false);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
      <h2
        className="font-bold text-4xl"
        style={{ whiteSpace: 'nowrap' }}
      >
        Νέα Αγγελία
        <span
          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-bold text-5xl mr-2 ml-3 font-inter"
          style={{ whiteSpace: 'nowrap' }}
        >
          Boost
        </span>
      </h2>
        <form className="p-10 border rounded-xl mt-10">
          {/* {Στοιχεία Προΐοντος} */}
          <div className="">
            <h2 className="font-md text-xl mb-6 ">Περιγραφή Προΐοντος</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {productDetails.productDetail.map((item, index) => (
                <div key={index} className="">
                  <label className="text-sm flex items-center gap-2 mb-2">
                    <IconField icon={item?.icon} /> {item?.label}{" "}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>

                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      productInfo={productInfo}
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <DropdownField
                      item={item}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      productInfo={productInfo}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField
                      item={item}
                      handleInputChange={handleInputChange}
                      productInfo={productInfo}
                    />
                  ) : item.fieldType === "tel" ? (
                    <InputField
                      item={item}
                      handleInputChange={handleInputChange}
                      productInfo={productInfo}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Eikones */}
          <Separator className="my-6" />
          <UploadImages
            triggerUploadImages={triggerUploadImages}
            plan="Boost"
            productInfo={productInfo}
            mode={mode}
            setLoader={(v) => {
                setLoader(v);
                navigate("/");
            }}
            onImagesChange={setHasImages}  // Add this prop
        />

          <div className="mt-10 flex justify-end">
            <Button type="button" disabled={loader} onClick={(e) => onSubmit(e)}>
              {!loader ? (
                "Ανάρτηση"
              ) : (
                <BiLoaderAlt className="text-[#fff] animate-spin text-lg" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoostListing;