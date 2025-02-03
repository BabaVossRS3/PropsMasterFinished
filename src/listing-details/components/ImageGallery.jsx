import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const customStyles = `
  .product-swiper-container {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .product-swiper {
    height: 400px !important;
    width: 100% !important;
  }
  
  .product-swiper .swiper-slide {
    height: 100%;
    width: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .product-swiper .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .thumbs-swiper {
    height: 80px !important;
    width: 100% !important;
  }
  
  .thumbs-swiper .swiper-slide {
    height: 100%;
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  
  .thumbs-swiper .swiper-slide-thumb-active {
    opacity: 1;
  }

  /* Hide default Swiper navigation buttons */
  .swiper-button-next,
  .swiper-button-prev {
    display: none !important;
  }
`;

const ImageGallery = ({ productDetail }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const images = productDetail?.images || [];

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === "Escape") closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setScale(1);
    }
  }, [isModalOpen]);

  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
    setScale(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScale(1);
  };

  const handleImageClick = (e) => {
    if (!isModalOpen) {
      openModal(e);
      return;
    }
    e.stopPropagation();
    setScale(scale === 1 ? 2 : 1);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="product-swiper-container rounded-xl bg-gray-100">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
          className="product-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image.imageUrl}
                alt={`Product image ${index + 1}`}
                onClick={handleImageClick}
                draggable="false"
                className="cursor-zoom-in"
              />
            </SwiperSlide>
          ))}
          
          {images.length > 1 && (
            <>
              <button
                className="swiper-button-prev absolute left-4 top-1/2 z-10 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white hover:text-orange-500 transition-colors shadow-lg transform -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <button
                className="swiper-button-next absolute right-4 top-1/2 z-10 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white hover:text-orange-500 transition-colors shadow-lg transform -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              >
                <FaArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
        </Swiper>
      </div>

      {images.length > 1 && (
        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Thumbs]}
            watchSlidesProgress
            onSwiper={setThumbsSwiper}
            slidesPerView={6}
            spaceBetween={8}
            className="thumbs-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div 
                  className={`h-full bg-transparent overflow-hidden rounded-lg cursor-pointer ${
                    selectedImageIndex === index ? 'ring-2 ring-orange-400' : 'hover:opacity-80'
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    className="w-full h-full object-cover"
                    alt={`Thumbnail ${index + 1}`}
                    draggable="false"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" 
          onClick={closeModal}
        >
          <div 
            className={`relative w-full max-w-4xl p-4 ${scale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} 
            onClick={e => e.stopPropagation()}
          >
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: '.modal-button-prev',
                nextEl: '.modal-button-next',
              }}
              initialSlide={selectedImageIndex}
              className="h-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`flex items-center justify-center transition-transform duration-200 ${
                      scale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    style={{ transform: `scale(${scale})` }}
                  >
                    <img
                      src={image.imageUrl}
                      className="max-h-[70vh] w-auto object-contain"
                      alt={`Full size image ${index + 1}`}
                      onClick={handleImageClick}
                      draggable="false"
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              {images.length > 1 && (
                <>
                  <button
                    className="modal-button-prev absolute left-4 top-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors transform -translate-y-1/2 w-10 h-10 flex items-center justify-center"
                  >
                    <FaArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="modal-button-next absolute right-4 top-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors transform -translate-y-1/2 w-10 h-10 flex items-center justify-center"
                  >
                    <FaArrowRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </Swiper>
            
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;