"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "../../constants";
import { formUrlQuery } from "../../lib/utils";

import { Button } from "../ui/button";

import { Search } from "./Search";

const Collection = ({ hasSearch = false, images, totalPages = 1, page }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="md:justify-between mb-6 flex flex-col gap-5 md:flex-row">
        <h2 className="text-[30px] font-bold md:text-[36px] leading-[110%] text-[#2B3674]">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <Card image={image} key={image._id} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-60 w-full rounded-[10px] border-[#7986AC]/10 bg-white/20">
          <p className="font-semibold text-[20px] leading-[140%]">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="py-4 px-6 flex items-center justify-center gap-3 rounded-full font-semibold text-[16px] leading-[140%] focus-visible:ring-offset-0 focus-visible:ring-transparent w-32 bg-[url('/assets/images/gradient-bg.svg')] bg-cover text-white"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex items-center justify-center font-medium text-[16px] leading-[140%] w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="py-4 px-6 flex items-center justify-center gap-3 rounded-full font-semibold text-[16px] leading-[140%] focus-visible:ring-offset-0 focus-visible:ring-transparent w-32 bg-[url('/assets/images/gradient-bg.svg')] bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({ image }) => {
  return (
    <li>
      <Link href={`/transformations/${image._id}`} className="flex flex-1 cursor-pointer flex-col gap-5 rounded-[16px] border-2 border-purple-200/15 bg-white p-4 shadow-xl shadow-purple-200/10 transition-all hover:shadow-purple-200/20">
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width || 800} // Default width
          height={image.height || 600}
          {...image.config}
          loading="lazy"
          className="h-52 w-full rounded-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="flex justify-between items-center">
          <p className=" font-semibold text-[20px] leading-[140%] mr-3 line-clamp-1 text-[#384262]">
            {image.title}
          </p>
          <Image
            src={`/assets/icons/${transformationTypes[image.transformationType].icon}`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};

export default Collection;