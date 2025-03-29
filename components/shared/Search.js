"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "../../lib/utils";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        const newUrl = formUrlQuery({
          searchParams: searchParams.toString(),
          key: "query",
          value: query,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          searchParams: searchParams.toString(),
          keysToRemove: ["query"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [router, searchParams, query]);

  return (
    <div className="flex w-full rounded-[16px] border-2 border-purple-200/20 bg-white px-4 shadow-sm shadow-purple-200/15 md:max-w-96">
      <Image
        src="/assets/icons/search.svg"
        alt="search"
        width={24}
        height={24}
      />

      <Input
        className="border-0 bg-transparent text-[#2B3674] w-full placeholder:text-[#7986AC] h-[50px] font-medium text-[16px] leading-[140%] focus-visible:ring-offset-0 p-3 focus-visible:ring-transparent"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};