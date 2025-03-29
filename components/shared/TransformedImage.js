"use client";

import { dataUrl, debounce, download, getImageSize } from "../../lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (image?.publicId && transformationConfig) {
      setIsLoaded(false);
      const updatedUrl = getCldImageUrl({
        width: image.width || 500,
        height: image.height || 500,
        src: image.publicId,
        ...transformationConfig,
      });

      setImageUrl(updatedUrl);
    }
  }, [image, transformationConfig]);

  const downloadHandler = async (e) => {
    e?.preventDefault();
    if (!imageUrl) return;
    download(imageUrl, title);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-[30px] font-bold leading-[140%] text-[#2B3674]">Transformed Image</h3>

        {hasDownload && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-[#624CF5] shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={downloadHandler}
          >
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={20}
              height={20}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
            <span className="text-sm font-medium">Download</span>
          </motion.button>
        )}
      </div>

      {/* Transformed Image Section */}
      {image?.publicId && transformationConfig ? (
        <div className="relative overflow-hidden border border-gray-200 bg-gray-50 shadow-sm ">
          {/* Loading Spinner (Before Image Loads) */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Image
                  src="/assets/icons/spinner.svg"
                  alt="Loading"
                  width={50}
                  height={50}
                />
              </motion.div>
            </div>
          )}

          {/* Image with Motion Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CldImage
              width={getImageSize(type, image, "width") || 500}
              height={getImageSize(type, image, "height") || 500}
              src={image.publicId}
              alt={title || "Transformed image"}
              sizes="(max-width: 767px) 100vw, 50vw"
              placeholder={dataUrl}
              className="w-full object-cover transition-opacity duration-300"
              onLoadingComplete={() => {
                setIsLoaded(true);
                setIsTransforming?.(false);
              }}
              onError={debounce(() => {
                setIsTransforming?.(false);
              }, 8000)}
              {...transformationConfig}
            />
          </motion.div>

          {/* Loader Overlay While Transforming */}
          {isTransforming && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Image
                  src="/assets/icons/spinner.svg"
                  alt="Processing"
                  width={50}
                  height={50}
                />
              </motion.div>
              <p className="absolute bottom-10 text-white font-medium">
                Processing your image...
              </p>
            </div>
          )}
        </div>
      ) : (
        /* No Image Placeholder */
        <div className="flex h-80 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 text-center">
          <Image
            src="/assets/icons/image.svg"
            alt="No image"
            width={60}
            height={60}
            className="opacity-50 mb-4"
          />
          <p className="text-gray-500 font-medium">
            No transformation applied yet
          </p>
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
