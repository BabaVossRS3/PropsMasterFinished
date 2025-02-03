// import { Content } from '@radix-ui/react-select';
// import { storage } from './../../../configs/firebaseConfig';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import React, { useEffect, useState } from 'react'
// import { IoMdCloseCircle } from "react-icons/io";
// import { ProductImages, ProductListing } from './../../../configs/schema';
// import { db } from './../../../configs';
// import { useToast } from "@/hooks/use-toast"
// import { eq } from 'drizzle-orm';

// const UploadImages = ({ plan, triggerUploadImages, setLoader, productInfo, mode }) => {
//     const [EditProductImageList, setEditProductImageList] = useState([]);
//     const [selectedFileList, setSelectedFileList] = useState([]);
//     const { toast } = useToast();

//     useEffect(() => {
//         if (mode === 'edit') {
//             setEditProductImageList([]);
//             productInfo?.images.forEach((image) => {
//                 setEditProductImageList((prev) => [...prev, image?.imageUrl]);
//             });
//         }
//     }, [productInfo]);

//     useEffect(() => {
//         if (triggerUploadImages) {
//             UploadImageToServer();
//         }
//     }, [triggerUploadImages]);

//     const onFileSelected = async (event) => {
//         const files = event.target.files;

//         // Handle Basic Plan restrictions
//         if (plan === "Basic" && files.length > 5) {
//             toast({
//                 variant: "destructive",
//                 title: "Υπέρβαση Ορίων Πλάνου Basic.",
//                 description: "Μπορείτε να Ανεβάσετε εως 5 Φωτογραφίες ανά αγγελία.",
//             });
//             return;
//         }

//         // Handle Boost Plan restrictions
//         if (plan === "Boost" && files.length > 5) {
//             toast({
//                 variant: "destructive",
//                 title: "Υπέρβαση Ορίων Πλάνου Boost.",
//                 description: "Μπορείτε να Ανεβάσετε εως 5 Φωτογραφίες ανά αγγελία.",
//             });
//             return;
//         }
//         if (plan === "Boost+" && files.length > 5) {
//             toast({
//                 variant: "destructive",
//                 title: "Υπέρβαση Ορίων Πλάνου Boost+.",
//                 description: "Μπορείτε να Ανεβάσετε εως 5 Φωτογραφίες ανά αγγελία.",
//             });
//             return;
//         }

//         for (let i = 0; i < files?.length; i++) {
//             const file = files[i];
//             let maxSize = 5 * 1024 * 1024; // 
//             let maxResolution = 1080;

//             if (plan === "Boost") {
//                 maxSize = 5 * 1024 * 1024; 
//                 maxResolution = 1080; 
//             }

//             if (plan === "Boost+") {
//                 maxSize = 5 * 1024 * 1024; 
//                 maxResolution = 2160;
//             }

//             // Check file size for both Basic and Boost plans
//             if (file.size > maxSize) {
//                 toast({
//                     variant: "destructive",
//                     title: `Υπέρβαση Ορίων Πλάνου ${plan}.`,
//                     description: `Μπορείτε να Ανεβάσετε Φωτογραφίες μεγέθους έως ${maxSize / (1024 * 1024)}MB.`,
//                 });
//                 return;
//             }

//             // Resize image based on resolution cap for both plans
//             const img = new Image();
//             const reader = new FileReader();

//             reader.onload = (e) => {
//                 img.onload = () => {
//                     // Resize the image
//                     const canvas = document.createElement("canvas");
//                     const ctx = canvas.getContext("2d");
//                     const maxWidth = maxResolution === 720 ? 1280 : 1920;
//                     const maxHeight = maxResolution === 720 ? 720 : 1080;
//                     let width = img.width;
//                     let height = img.height;

//                     if (width > height) {
//                         if (width > maxWidth) {
//                             height *= maxWidth / width;
//                             width = maxWidth;
//                         }
//                     } else {
//                         if (height > maxHeight) {
//                             width *= maxHeight / height;
//                             height = maxHeight;
//                         }
//                     }

//                     canvas.width = width;
//                     canvas.height = height;
//                     ctx.drawImage(img, 0, 0, width, height);

//                     // Create a new file from the resized image
//                     canvas.toBlob((blob) => {
//                         const resizedFile = new File([blob], file.name, { type: file.type });
//                         setSelectedFileList((prev) => [...prev, resizedFile]);
//                     }, file.type);
//                 };
//                 img.src = e.target.result;
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const onImageRemove = (image, index) => {
//         const result = selectedFileList.filter((item) => item !== image);
//         setSelectedFileList(result);
//     };

//     const onImageRemoveFromDB = async (image, index) => {
//         const result = await db.delete(ProductImages).where(eq(ProductImages.id, productInfo?.images[index]?.id)).returning({ id: ProductImages.id });

//         const imageList = EditProductImageList.filter(item => item !== image);
//         setEditProductImageList(imageList);
//     };

//     const UploadImageToServer = async () => {
//         setLoader(true);
//         await selectedFileList.forEach((file) => {
//             const fileName = Date.now() + '.jpeg';
//             const storageRef = ref(storage, fileName);
//             const metaData = {
//                 contentType: 'image/jpeg',
//             };
//             uploadBytes(storageRef, file, metaData).then((snapShot) => {
//                 console.log('Uploaded File');
//             }).then(() => {
//                 getDownloadURL(storageRef).then(async (downloadUrl) => {
//                     console.log(downloadUrl);
//                     await db.insert(ProductImages).values({
//                         imageUrl: downloadUrl,
//                         ProductListingId: triggerUploadImages,
//                     });
//                 });
//             });
//             setLoader(false);
//         });
//     };

//     return (
//         <div>
//             <h2 className="font-medium text-xl my-3">Εικόνες Προϊόντος</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
//                 {mode === 'edit' &&
//                     EditProductImageList.map((image, index) => (
//                         <div key={index} className="">
//                             <IoMdCloseCircle className="absolute m-2 text-lg cursor-pointer text-orange-500" onClick={() => onImageRemoveFromDB(image, index)} />
//                             <img src={image} className="w-full h-[130px] object-cover rounded-xl" alt="" />
//                         </div>
//                     ))}

//                 {selectedFileList.map((image, index) => (
//                     <div key={index} className="">
//                         <IoMdCloseCircle className="absolute m-2 text-lg cursor-pointer text-orange-500" onClick={() => onImageRemove(image, index)} />
//                         <img src={URL.createObjectURL(image)} className="w-full h-[130px] object-cover rounded-xl" alt="" />
//                     </div>
//                 ))}
//                 <label htmlFor="upload-images">
//                     <div className="cursor-pointer hover:scale-105 hover:transition-all border rounded-xl border-dotted border-orange-500 bg-orange-100">
//                         <h2 className="text-5xl text-center p-10 opacity-55 text-orange-500">+</h2>
//                     </div>
//                 </label>
//                 <input type="file" multiple={true} id="upload-images" className="opacity-0" onChange={onFileSelected} />
//             </div>
//         </div>
//     );
// };

// export default UploadImages;
import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";
import { ProductImages } from './../../../configs/schema';
import { storage } from './../../../configs/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db } from './../../../configs';
import { eq } from 'drizzle-orm';

const UploadImages = ({ plan, triggerUploadImages, setLoader, productInfo, mode, onImagesChange }) => {
    const [EditProductImageList, setEditProductImageList] = useState([]);
    const [selectedFileList, setSelectedFileList] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        if (mode === 'edit' && productInfo?.images) {
            setEditProductImageList([]);
            productInfo.images.forEach((image) => {
                setEditProductImageList((prev) => [...prev, image?.imageUrl]);
            });
        }
    }, [productInfo]);

    // Notify parent component whenever images change
    useEffect(() => {
        const totalImages = EditProductImageList.length + selectedFileList.length;
        onImagesChange(totalImages > 0);
    }, [EditProductImageList, selectedFileList]);

    useEffect(() => {
        if (triggerUploadImages) {
            UploadImageToServer();
        }
    }, [triggerUploadImages]);

    const compressImage = async (file, maxWidth, maxHeight, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate dimensions while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round(height * maxWidth / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round(width * maxHeight / height);
                            height = maxHeight;
                        }
                    }

                    // Set canvas dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.fillStyle = '#fff';  // Set white background
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    // Apply sharpening if image is being downsized
                    if (width < img.width || height < img.height) {
                        const imageData = ctx.getImageData(0, 0, width, height);
                        const data = imageData.data;
                        for (let i = 0; i < data.length; i += 4) {
                            data[i] = data[i] * 1.1;     // Red
                            data[i + 1] = data[i + 1] * 1.1; // Green
                            data[i + 2] = data[i + 2] * 1.1; // Blue
                        }
                        ctx.putImageData(imageData, 0, 0);
                    }

                    // Convert to blob
                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', quality);
                };
            };
        });
    };

    const onFileSelected = async (event) => {
        const files = event.target.files;

        // Handle plan restrictions
        if (plan === "Basic" && files.length > 5) {
            toast({
                variant: "destructive",
                title: "Υπέρβαση Ορίων Πλάνου Basic.",
                description: "Μπορείτε να Ανεβάσετε εως 5 Φωτογραφίες ανά αγγελία.",
            });
            return;
        }

        if ((plan === "Boost" || plan === "Boost+") && files.length > 5) {
            toast({
                variant: "destructive",
                title: `Υπέρβαση Ορίων Πλάνου ${plan}.`,
                description: "Μπορείτε να Ανεβάσετε εως 5 Φωτογραφίες ανά αγγελία.",
            });
            return;
        }

        for (let i = 0; i < files?.length; i++) {
            const file = files[i];
            let maxSize = 5 * 1024 * 1024;
            let maxWidth = 1280;
            let maxHeight = 720;
            let quality = 0.8;

            // Adjust compression settings based on plan
            if (plan === "Boost") {
                maxWidth = 1920;
                maxHeight = 1080;
                quality = 0.85;
            } else if (plan === "Boost+") {
                maxWidth = 2560;
                maxHeight = 1440;
                quality = 0.9;
            }

            try {
                // Compress the image
                const compressedFile = await compressImage(file, maxWidth, maxHeight, quality);

                // Check if compressed file still exceeds max size
                if (compressedFile.size > maxSize) {
                    toast({
                        variant: "destructive",
                        title: `Υπέρβαση Ορίων Πλάνου ${plan}.`,
                        description: `Μπορείτε να Ανεβάσετε Φωτογραφίες μεγέθους έως ${maxSize / (1024 * 1024)}MB.`,
                    });
                    continue;
                }

                setSelectedFileList((prev) => [...prev, compressedFile]);
            } catch (error) {
                console.error('Error compressing image:', error);
                toast({
                    variant: "destructive",
                    title: "Σφάλμα Επεξεργασίας",
                    description: "Παρουσιάστηκε σφάλμα κατά την επεξεργασία της εικόνας.",
                });
            }
        }
    };

    const onImageRemove = (image, index) => {
        const result = selectedFileList.filter((item) => item !== image);
        setSelectedFileList(result);
    };

    const onImageRemoveFromDB = async (image, index) => {
        try {
            const result = await db
                .delete(ProductImages)
                .where(eq(ProductImages.id, productInfo?.images[index]?.id))
                .returning({ id: ProductImages.id });

            const imageList = EditProductImageList.filter(item => item !== image);
            setEditProductImageList(imageList);
        } catch (error) {
            console.error('Error removing image:', error);
            toast({
                variant: "destructive",
                title: "Σφάλμα Διαγραφής",
                description: "Παρουσιάστηκε σφάλμα κατά τη διαγραφή της εικόνας.",
            });
        }
    };

    const UploadImageToServer = async () => {
        setLoader(true);
        try {
            await Promise.all(selectedFileList.map(async (file) => {
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpeg`;
                const storageRef = ref(storage, fileName);
                const metaData = {
                    contentType: 'image/jpeg',
                };
                
                await uploadBytes(storageRef, file, metaData);
                const downloadUrl = await getDownloadURL(storageRef);
                
                await db.insert(ProductImages).values({
                    imageUrl: downloadUrl,
                    ProductListingId: triggerUploadImages,
                });
            }));
        } catch (error) {
            console.error('Error uploading images:', error);
            toast({
                variant: "destructive",
                title: "Σφάλμα Μεταφόρτωσης",
                description: "Παρουσιάστηκε σφάλμα κατά τη μεταφόρτωση των εικόνων.",
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <div>
            <h2 className="font-medium text-xl my-3">
                Εικόνες Προϊόντος 
                <span className="text-red-500 ml-1">*</span>
                <span className="text-sm text-gray-500 ml-2">(Απαιτείται τουλάχιστον 1 φωτογραφία)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {mode === 'edit' && EditProductImageList.length > 0 && 
                    EditProductImageList.map((image, index) => (
                        <div key={index} className="relative">
                            <IoMdCloseCircle 
                                className="absolute m-2 text-lg cursor-pointer text-orange-500" 
                                onClick={() => onImageRemoveFromDB(image, index)} 
                            />
                            <img src={image} className="w-full h-[130px] object-cover rounded-xl" alt="" />
                        </div>
                    ))}

                {selectedFileList.map((image, index) => (
                    <div key={index} className="relative">
                        <IoMdCloseCircle 
                            className="absolute m-2 text-lg cursor-pointer text-orange-500" 
                            onClick={() => onImageRemove(image, index)} 
                        />
                        <img 
                            src={URL.createObjectURL(image)} 
                            className="w-full h-[130px] object-cover rounded-xl" 
                            alt="" 
                        />
                    </div>
                ))}

                {/* Upload button */}
                <label htmlFor="upload-images">
                    <div className="cursor-pointer hover:scale-105 hover:transition-all border rounded-xl border-dotted border-orange-500 bg-orange-100">
                        <h2 className="text-5xl text-center p-10 opacity-55 text-orange-500">+</h2>
                    </div>
                </label>
                <input 
                    type="file" 
                    multiple={true} 
                    id="upload-images" 
                    className="opacity-0" 
                    onChange={onFileSelected} 
                    accept="image/*" 
                />
            </div>
        </div>
    );
};

export default UploadImages;