/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { clsx } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";

import { aspectRatioOptions } from "../constants";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error) => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

// PLACEHOLDER LOADER - while image is transforming
const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#7986AC" offset="20%" />
      <stop stop-color="#68769e" offset="50%" />
      <stop stop-color="#7986AC" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#7986AC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(1000, 1000)
)}`;

// FORM URL QUERY
export const formUrlQuery = ({ searchParams, key, value }) => {
  const params = { ...qs.parse(searchParams.toString()), [key]: value };

  return `${window.location.pathname}?${qs.stringify(params, {
    skipNulls: true,
  })}`;
};

// REMOVE KEY FROM QUERY
export function removeKeysFromQuery({ searchParams, keysToRemove }) {
  const currentUrl = qs.parse(searchParams);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  Object.keys(currentUrl).forEach(
    (key) => currentUrl[key] == null && delete currentUrl[key]
  );

  return `${window.location.pathname}?${qs.stringify(currentUrl)}`;
}

// DEBOUNCE
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// GET IMAGE SIZE
export const getImageSize = (type, image, dimension) => {
  if (type === "fill") {
    return (
      aspectRatioOptions[image.aspectRatio]?.[dimension] || 1000
    );
  }
  return image?.[dimension] || 1000;
};

// DOWNLOAD IMAGE
export const download = async (url, filename = "image") => {
  if (!url) throw new Error("Resource URL not provided");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    const blobURL = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = blobURL;
    a.download = `${filename.replace(/\s+/g, "_")}.png`; // Force PNG extension
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error(`Download failed: ${error.message}`);
  }
};


// DEEP MERGE OBJECTS
export const deepMergeObjects = (obj1, obj2) => {
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  let output = { ...obj2 };

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        obj2[key] &&
        typeof obj2[key] === "object"
      ) {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};
