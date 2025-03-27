"use client";

import { dataUrl, debounce, download, getImageSize } from "../../lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (image?.publicId && transformationConfig) {
      const updatedUrl = getCldImageUrl({
        width: image.width || 500,
        height: image.height || 500,
        src: image.publicId,
        ...transformationConfig,
      });

      setImageUrl(updatedUrl);
      console.log("Updated transformation URL:", updatedUrl);
    }
  }, [image, transformationConfig]); // Re-run when image or transformationConfig updates

const downloadHandler = async (e) => {
    e?.preventDefault();
  
    if (!image?.publicId) {
      throw new Error("Missing required image data");
    }
  
    download(getCldImageUrl({
      width: image?.width,
      height: image?.height,
      src: image?.publicId,
      ...transformationConfig
    }), title)
  };
  
  

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-[30px] leading-[140%] text-[#2B3674]">
          Transformed Image
        </h3>

        {hasDownload && (
          <button
            className="font-medium text-[14px] leading-[120%] mt-2 flex items-center gap-2 px-2"
            onClick={downloadHandler}
          >
            <Image
              src="/assets/icons/download.svg"
              alt="Download Image"
              width={24}
              height={24}
              className="pb-[6px]"
            />
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width") || 500}
            height={getImageSize(type, image, "height") || 500}
            src={image.publicId}
            alt={image?.title || "Transformed Image"}
            sizes="(max-width: 767px) 100vw, 50vw"
            placeholder={dataUrl}
            className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 object-cover p-2 transition-all duration-500 ease-in-out"
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)()
            }}
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#384262]/80 rounded-[10px]">
              <Image
                src="/assets/icons/spinner.svg"
                alt="Transforming Image"
                height={50}
                width={50}
                className="animate-spin"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-72 cursor-pointer gap-4 rounded-xl border border-dashed bg-[#F4F7FE]/30 p-6 shadow-inner transition-all hover:bg-[#F4F7FE]/50">
          No Transformation Applied
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
