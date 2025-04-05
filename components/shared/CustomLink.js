"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoadingBar from "react-top-loading-bar";

export default function CustomLink({ href, children, ...props }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    setProgress(40);
    setTimeout(() => setProgress(60), 300); 
  };
  useEffect(() => {
    if (progress > 0) {
      setProgress(100); 
    }
  }, [pathname]);

  return (
    <>
      <LoadingBar color="#624cf5" height={3} progress={progress} onLoaderFinished={() => setProgress(0)} />
      <Link href={href} {...props} onClick={handleClick}>
        {children}
      </Link>
    </>
  );
}
