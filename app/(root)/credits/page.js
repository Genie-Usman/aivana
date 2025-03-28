import { SignedIn } from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import Header from "../../../components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "../../../constants";
import { getUserById } from "../../../lib/actions/User.actions";
import Checkout from "../../../components/shared/Checkout";

const Credits = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <>
      <Header
        title="Buy Credits"
        subTitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className=" mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-9 xl:grid-cols-3">
          {plans.map((plan) => (
            <li key={plan.name} className="w-full rounded-[16px] border-2 border-[#BCB6FF]/20 bg-white p-8 shadow-xl shadow-[#BCB6FF]/20 lg:max-w-none">
              <div className="flex items-center justify-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="font-semibold text-[20px] leading-[140%] mt-2 text-[#7857FF]">
                  {plan.name}
                </p>
                <p className="text-[36px] font-semibold sm:text-[44px] leading-[120%] sm:leading-[56px] text-[#2B3674]">${plan.price}</p>
                <p className="font-normal text-[16px] leading-[140%]">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="font-normal text-[16px] leading-[140%]">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" 
                className=" w-full rounded-full bg-[#F4F7FE] bg-cover text-[#7857FF] hover:text-[#7857FF]">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    buyerId={user._id}
                  />
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;