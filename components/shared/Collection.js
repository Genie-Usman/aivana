"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { useMemo } from "react";
import { Pagination, PaginationContent, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { transformationTypes } from "../../constants";
import { formUrlQuery } from "../../lib/utils";
import { Button } from "../ui/button";
import { Search } from "./Search";

const Collection = ({ hasSearch = false, images, totalPages = 1, page }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPageChange = useMemo(() => (action) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });
    router.push(newUrl, { scroll: false });
  }, [page, searchParams, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Recent Edits
          </h2>
          <p className="mt-2 text-gray-600">
            Latest image transformations
          </p>
        </div>
        {hasSearch && <Search />}
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Card image={image} key={image._id} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 w-full rounded-xl bg-gradient-to-br from-purple-50 to-white border-2 border-dashed border-purple-100 p-8 text-center">
          <Image
            src="/assets/icons/image.svg"
            alt="No images available"
            width={60}
            height={60}
            className="opacity-50 mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No images found</h3>
          <p className="text-gray-500 max-w-md">
            Upload and transform your first image to see it appear here
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent className="flex w-full items-center justify-between">
            <Button
              disabled={Number(page) <= 1}
              className="group py-3 px-6 flex items-center gap-2 rounded-full font-medium text-white bg-[url('/assets/images/gradient-bg.svg')] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white cursor-pointer" />
            </Button>

            <p className="text-sm font-medium text-gray-600">
              Page <span className="font-semibold text-[#624CF5]">{page}</span> of{" "}
              <span className="font-semibold text-gray-700">{totalPages}</span>
            </p>

            <Button
              className="group py-3 px-6 flex items-center gap-2 rounded-full font-medium text-white bg-[url('/assets/images/gradient-bg.svg')] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white cursor-pointer" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const Card = ({ image, priority }) => {
  return (
    <div className="group relative overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <Link href={`/transformations/${image._id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <CldImage
            src={image.publicId}
            alt={image.title}
            width={image.width || 800}
            height={image.height || 800}
            {...image.config}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            className="h-full w-full object-cover transform scale-100 transition-transform duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
              {image.title}
            </h3>
            <div className="flex-shrink-0 p-2 rounded-lg bg-purple-100 text-[#624CF5]">
              <Image
                src={`/assets/icons/${transformationTypes[image.transformationType]?.icon}`}
                alt={`${image.title} icon`}
                width={20}
                height={20}
                className="transition-transform group-hover:scale-110"
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 truncate">
            {transformationTypes[image.transformationType]?.title}
          </p>
        </div>
      </Link>
    </div>
  );
};


export default Collection;
