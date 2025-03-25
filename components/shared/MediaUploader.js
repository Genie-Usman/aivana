"use client";

import { dataUrl, getImageSize } from "../../lib/utils";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Lazy-load Cloudinary Upload Widget to avoid hydration issues
const CldUploadWidget = dynamic(() => import("next-cloudinary").then(mod => mod.CldUploadWidget), { ssr: false });

const MediaUploader = ({ onChange, setImage, publicId, image, type }) => {
  const successHandler = (result) => {
    setImage((prevState) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    onChange(result?.info?.public_id);

    toast.success("Image uploaded successfully! 1 credit deducted from your account.", {
      duration: 3000,
      className: "bg-green-100 text-green-900",
    });
  };

  const errorHandler = () => {
    toast.error("Something went wrong while uploading. Please try again!", {
      duration: 3000,
      className: "bg-red-100 text-red-900",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="musman_aivana"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={successHandler}
      onError={errorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[30px] leading-[140%] text-[#2B3674]">
            Original
          </h3>

          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image, "width") || 500}
                height={getImageSize(type, image, "height") || 500}
                src={publicId}
                alt="Uploaded image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={dataUrl}
                className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-[#F4F7FE]/20 object-cover p-2"
                priority
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center h-72 cursor-pointer gap-4 rounded-xl border border-dashed bg-[#F4F7FE]/30 p-6 shadow-inner transition-all hover:bg-[#F4F7FE]/50"
              onClick={(e) => {
                e.preventDefault();
                if (typeof open === "function") open();
              }}
            >
              <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-md shadow-[#BCB6FF]/40">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-sm font-medium leading-tight text-gray-700">
                Click here to upload an image
              </p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
