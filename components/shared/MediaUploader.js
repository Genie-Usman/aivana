"use client";

import { dataUrl, getImageSize } from "../../lib/utils";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import { Toaster } from "./Toasts";
import { PencilIcon } from "lucide-react";

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

    Toaster.success(
      'Image uploaded successfully!',
      'deducted from your account',
      1
    );
  };

  const errorHandler = () => {
    Toaster.error(
      "Something went wrong while uploading.",
      "Please try again!");
  };

  return (
    <CldUploadWidget
  uploadPreset="musman_aivana"
  options={{
    multiple: false,
    resourceType: "image",
    styles: {
      palette: {
        window: "#FFFFFF",
        windowBorder: "#624CF5",
        tabIcon: "#624CF5",
        textDark: "#000000",
        textLight: "#FFFFFF",
        link: "#624CF5",
        action: "#624CF5",
        error: "#F44235",
        inProgress: "#624CF5",
        complete: "#20B832",
        sourceBg: "#F4F7FE"
      },
      fonts: {
        default: {
          family: "IBM Plex Sans",
          weight: "500"
        }
      }
    }
  }}
  onSuccess={successHandler}
  onError={errorHandler}
>
      {({ open }) => (
        <div className="flex flex-col gap-6">
          <h3 className="text-[30px] font-bold leading-[140%] text-[#2B3674]">
            Original Image
          </h3>

          {publicId ? (
            <div className="group relative overflow-hidden shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 transition-opacity group-hover:opacity-100 z-10" />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof open === "function") open();
                }}
                className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900 opacity-0 group-hover:opacity-100"
              >
                <PencilIcon className="h-3 w-3" />
                Replace
              </button>
              <CldImage
                width={getImageSize(type, image, "width") || 600}
                height={getImageSize(type, image, "height") || 600}
                src={publicId}
                alt="Uploaded image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={dataUrl}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                priority
              />
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.preventDefault();
                if (typeof open === "function") open();
              }}
              className="flex h-80 cursor-pointer flex-col items-center justify-center gap-5 rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 text-center transition-all hover:border-gray-300 hover:bg-gray-50/80 hover:shadow-inner"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 shadow-lg shadow-indigo-100/50 ring-1 ring-gray-200/50">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                  className="text-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-700">
                  Upload your image
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, or WEBP (Max 10MB)
                </p>
              </div>
              <button
                type="button"
                className="mt-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Select File
              </button>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
