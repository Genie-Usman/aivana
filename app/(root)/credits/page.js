import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { plans } from "../../../constants";
import { getUserById } from "../../../lib/actions/User.actions";
import Checkout from "../../../components/shared/Checkout";

const Credits = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-2">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-[#2B3674] text-center mb-4">
            Buy Credits
          </h1>
          <p className="text-[#4A5568] text-center leading-relaxed">
            Choose a credit package that suits your needs and unleash your creative vision
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isFeatured = index === 1;

              return (
                <div
                  key={plan.name}
                  className={`relative ${isFeatured
                      ? 'bg-white border-0 ring-2 ring-[#624cf5] z-10 shadow-xl'
                      : 'bg-white border border-[#e2e8f0]'
                    } p-8 rounded-2xl hover:shadow-lg transition-all duration-300`}
                >
                  {isFeatured && (
                    <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                      <span className="bg-[#624cf5] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                        RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`p-4 rounded-full ${isFeatured
                        ? 'bg-[#624cf5]/10'
                        : 'bg-[#F4F7FE]'
                      } w-20 h-20 mx-auto mb-6 flex items-center justify-center`}>
                      <Image
                        src={plan.icon}
                        alt={plan.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <h3 className={`text-xl font-bold ${isFeatured ? 'text-[#624cf5]' : 'text-[#2B3674]'}`}>
                      {plan.name}
                    </h3>
                    <div className="mt-3 mb-2">
                      <span className={`text-4xl font-bold ${isFeatured ? 'text-[#624cf5]' : 'text-[#2B3674]'}`}>
                        ${plan.price}
                      </span>
                    </div>
                    <p className="text-[#718096] text-sm">
                      {plan.credits} Credits
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-6 mb-8">
                    <ul className="space-y-4">
                      {plan.inclusions.map((inclusion) => (
                        <li
                          key={plan.name + inclusion.label}
                          className="flex items-start"
                        >
                          <span className={`flex-shrink-0 mr-3 mt-0.5 ${inclusion.isIncluded ? 'text-green-500' : 'text-gray-300'}`}>
                            {inclusion.isIncluded ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                              </svg>
                            )}
                          </span>
                          <span className={`text-sm font-medium ${inclusion.isIncluded ? 'text-[#2B3674]' : 'text-[#A0AEC0]'}`}>
                            {inclusion.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    {plan.name === "Free" ? (
                      <Button
                        variant={isFeatured ? "default" : "outline"}
                        className={`w-full py-6 rounded-full cursor-pointer ${isFeatured
                            ? 'bg-[#624cf5] hover:bg-[#513cd6] text-white font-medium'
                            : 'border border-[#e2e8f0] text-[#624cf5] hover:text-[#513cd6] hover:border-[#624cf5] hover:bg-[#624cf5]/5'
                          }`}
                      >
                        Free Consumable
                      </Button>
                    ) : (
                      <SignedIn>
                        <div className="w-full">
                          <Checkout
                            plan={plan.name}
                            amount={plan.price}
                            credits={plan.credits}
                            buyerId={user._id}
                          />
                        </div>
                      </SignedIn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center">
              <div className="bg-[#624cf5]/10 p-4 rounded-full mr-5">
                <Image
                  src="/assets/icons/credit-coins.svg"
                  alt="Credits"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-lg text-[#2B3674]">Made by Usman</p>
              </div>
            </div>
            <Button asChild className="border-1">
              <a
                href="https://www.github.com/Genie-Usman"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap min-w-[140px] h-12 rounded-full border-[#624cf5]/30 hover:border-[#624cf5] text-[#624cf5] hover:bg-[#624cf5]/5 font-medium cursor-pointer"
              >
                Visit Github
              </a>
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;