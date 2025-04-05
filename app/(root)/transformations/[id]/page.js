import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import Header from "../../../../components/shared/Header";
import TransformedImage from "../../../../components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { getImageById } from "../../../../lib/actions/Image.actions";
import { getImageSize } from "../../../../lib/utils";
import { DeleteConfirmation } from "../../../../components/shared/DeleteConfirmation";
import { Pencil } from "lucide-react";

const ImageDetails = async ({ params }) => {
  const { id } = await params;
  const { userId } = await auth();

  const imageData = await getImageById(id);
  if (!imageData) return <p>Image not found</p>;

  const image = JSON.parse(JSON.stringify(imageData));

  return (
  <>
    <Header title={image.title} />

    <section className="mt-5 flex flex-wrap gap-4">
      <div className="flex gap-2 text-[14px] font-medium leading-[120%] md:text-[16px] md:leading-[140%]">
        <p className="text-[#2B3674]">Transformation:</p>
        <p className="capitalize text-purple-400">{image.transformationType}</p>
      </div>

      {image.prompt && (
        <>
          <p className="hidden text-[#606C80]/50 md:block">&#x25CF;</p>
          <div className="flex gap-2 text-[14px] font-medium leading-[120%] md:text-[16px] md:leading-[140%]">
            <p className="text-[#2B3674]">Prompt:</p>
            <p className="capitalize text-purple-400">{image.prompt}</p>
          </div>
        </>
      )}

      {image.color && (
        <>
          <p className="hidden text-[#606C80]/50 md:block">&#x25CF;</p>
          <div className="flex gap-2 text-[14px] font-medium leading-[120%] md:text-[16px] md:leading-[140%]">
            <p className="text-[#2B3674]">Color:</p>
            <p className="capitalize text-purple-400">{image.color}</p>
          </div>
        </>
      )}

      {image.aspectRatio && (
        <>
          <p className="hidden text-[#606C80]/50 md:block">&#x25CF;</p>
          <div className="flex gap-2 text-[14px] font-medium leading-[120%] md:text-[16px] md:leading-[140%]">
            <p className="text-[#2B3674]">Aspect Ratio:</p>
            <p className="capitalize text-purple-400">{image.aspectRatio}</p>
          </div>
        </>
      )}
    </section>

    <section className="mt-10 border-t border-[#606C80]/15">
      <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-8 md:grid-cols-2">
        {/* ORIGINAL IMAGE */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[30px] font-bold leading-[140%] text-[#2B3674]">Original</h3>

          {image.secureURL ? (
            <Image
              width={getImageSize(image.transformationType, image, "width")}
              height={getImageSize(image.transformationType, image, "height")}
              src={image.secureURL}
              alt={image.title || "Transformed image"}
              className="h-fit min-h-72 w-full rounded-[10px] border-dashed bg-purple-100/20 object-cover p-2"
            />
          ) : (
            <p className="text-red-500">Image URL is missing.</p>
          )}
        </div>

        {/* TRANSFORMED IMAGE */}
        <TransformedImage
          image={image}
          type={image.transformationType}
          title={image.title}
          isTransforming={false}
          transformationConfig={image.config}
          hasDownload={true}
          transformationURL={image.transformationURL}
        />
      </div>

      {userId === image.author?.clerkId && (
        <div className="mt-4 space-y-4">
          <Button asChild type="button" className="h-[50px] w-full text-white rounded-full bg-[url('/assets/images/gradient-bg.svg')] bg-cover py-4 px-6 text-[16px] font-semibold leading-[140%] capitalize md:h-[54px] shadow-md hover:shadow-lg shadow-[#624CF5]/20 transition-all duration-300 hover:opacity-95">
            <Link href={`/transformations/${image._id}/update`} className="flex items-center justify-center gap-2 w-full">
              <Pencil className="h-5 w-5" />
              Update Image
            </Link>
          </Button>
          <DeleteConfirmation imageId={image._id} />
        </div>
      )}
    </section>
  </>
  );
};

export default ImageDetails;
