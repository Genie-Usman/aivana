"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const InsufficientCreditsModal = () => {
  const router = useRouter();

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="max-w-md rounded-2xl border-0 p-6 shadow-lg bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header Section */}
          <AlertDialogHeader className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#624CF5] uppercase tracking-wide">
                Insufficient Credits
              </p>
              <AlertDialogCancel
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                onClick={() => router.push("/profile")}
              >
                <Image
                  src="/assets/icons/close.svg"
                  alt="Close"
                  width={20}
                  height={20}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </AlertDialogCancel>
            </div>

            {/* Animated Image */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, ease: "easeOut" }}
              className="mx-auto mb-6"
            >
              <Image
                src="/assets/images/stacked-coins.png"
                alt="Credit coins"
                width={320}
                height={106}
                className="object-contain drop-shadow-md"
              />
            </motion.div>

            <AlertDialogTitle className="text-2xl font-extrabold text-gray-900 text-center mb-3">
              Oops... You're out of credits!
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-gray-500 leading-relaxed">
              No worries! Get more credits to continue using our services.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Footer Section */}
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} className="w-full">
              <AlertDialogCancel
                className="w-full py-3 px-6 cursor-pointer rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
                onClick={() => router.push("/profile")}
              >
                No, Cancel
              </AlertDialogCancel>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} className="w-full">
              <AlertDialogAction
                className="w-full py-3 cursor-pointer px-6 rounded-xl font-medium text-white bg-[url('/assets/images/gradient-bg.svg')] hover:from-purple-700 hover:to-[#624CF5]/90 transition-all shadow-md hover:shadow-lg"
                onClick={() => router.push("/credits")}
              >
                Yes, Get Credits
              </AlertDialogAction>
            </motion.div>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
