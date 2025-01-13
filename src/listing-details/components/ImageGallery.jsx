import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

const ImageGallery = ({ productDetail }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const images = productDetail?.images || [];

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, selectedImageIndex]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  const modalStyles = () => {
    const { width, height } = imageDimensions;
    if (width > screenWidth * 0.9) {
      return {
        width: `${screenWidth * 0.5}px`,
        height: `${height * (screenWidth * 0.5) / width}px`,
      };
    }
    if (height > window.innerHeight * 0.4) {
      return {
        width: `${width * (window.innerHeight * 0.4) / height}px`,
        height: `${window.innerHeight * 0.5}px`,
      };
    }
    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="image-gallery flex flex-col gap-4">
      {/* Main image */}
      {images.length > 0 && (
        <img
          src={images[selectedImageIndex]?.imageUrl}
          className="w-full object-cover h-[500px] rounded-xl cursor-pointer"
          alt={`Product image ${selectedImageIndex + 1}`}
          onClick={openModal}
        />
      )}

      {/* Thumbnail navigation - now below the main image */}
      <div className="thumbnail-container flex flex-wrap justify-center gap-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.imageUrl}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
              selectedImageIndex === index ? 'border-orange-500' : 'border-gray-300'
            }`}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleBackdropClick}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            style={modalStyles()}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImageIndex]?.imageUrl}
              className="w-full h-full object-contain"
              alt={`Full View Image ${selectedImageIndex + 1}`}
              onLoad={handleImageLoad}
            />

            <button
              className="opacity-50 z-60 absolute top-4 right-4 bg-transparent text-white text-3xl w-8 h-8 rounded-full flex justify-center items-center hover:scale-125 hover:text-orange-500 transition-all"
              onClick={closeModal}
            >
              <span className="x-mark-image-zoomed text-lg">&#x274c;</span>
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="opacity-70 absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent text-orange-500 text-xl px-3 py-2 rounded-full hover:bg-orange-100 transition-all hover:text-orange-500"
                  onClick={goToPrevious}
                >
                  <FaArrowLeft />
                </button>
                <button
                  className="opacity-70 absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent text-orange-500 text-xl px-3 py-2 rounded-full hover:bg-orange-100 transition-all hover:text-orange-500"
                  onClick={goToNext}
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;