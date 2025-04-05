import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import Header from "../../../components/shared/Header";
import Collection from "../../../components/shared/Collection";
import { getUserImages } from "../../../lib/actions/Image.actions";
import { getUserById } from "../../../lib/actions/User.actions";
import Link from "next/link";

const Profile = async ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const images = await getUserImages({ page, userId: user._id });

  return (
    <div className="container mx-auto px-4">
      <Header title="Profile" />

      <section className="mt-8 flex flex-col gap-6 sm:flex-row md:gap-8">
        <div className="w-full rounded-[16px] border-2 border-purple-200/20 bg-white p-6 md:p-8 shadow-lg shadow-purple-200/10 transition-all duration-300 hover:shadow-xl">
          <p className="font-medium text-[#4A5568] text-[14px] leading-[120%] md:text-[16px] md:leading-[140%]">CREDITS AVAILABLE</p>
          <div className="mt-5 flex items-center gap-4">
            <div className="bg-[#624cf5]/10 p-3 rounded-full">
              <Image
                src="/assets/icons/coins.svg"
                alt="coins"
                width={50}
                height={50}
                className="size-9 md:size-12"
              />
            </div>
            <h2 className="text-[30px] font-bold md:text-[36px] leading-[110%] text-[#2B3674]">{user.creditBalance}</h2>
          </div>
          <div className="mt-6">
            <Link 
              href="/credits" 
              className="inline-block px-5 py-2 rounded-full border-2 border-[#624cf5]/30 text-[#624cf5] hover:bg-[#624cf5]/5 font-medium cursor-pointer text-sm transition-all duration-300"
            >
              Buy More Credits
            </Link>
          </div>
        </div>

        <div className="w-full rounded-[16px] border-2 border-purple-200/20 bg-white p-6 md:p-8 shadow-lg shadow-purple-200/10 transition-all duration-300 hover:shadow-xl">
          <p className="font-medium text-[#4A5568] text-[14px] leading-[120%] md:text-[16px] md:leading-[140%]">IMAGE MANIPULATION DONE</p>
          <div className="mt-5 flex items-center gap-4">
            <div className="bg-[#624cf5]/10 p-3 rounded-full">
              <Image
                src="/assets/icons/photo.svg"
                alt="images"
                width={50}
                height={50}
                className="size-9 md:size-12"
              />
            </div>
            <h2 className="text-[30px] font-bold md:text-[36px] leading-[110%] text-[#2B3674]">{images?.data.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h3 className="text-2xl font-bold text-[#2B3674] mb-6">Your Creations</h3>
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </div>
  );
};

export default Profile;