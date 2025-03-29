"use client";

import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteImage } from "../../lib/actions/Image.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const DeleteConfirmation = ({ imageId }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      type="button"
      className="h-[44px] md:h-[54px] w-full rounded-full font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-sm hover:from-red-600 hover:to-red-700 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 cursor-pointer"
    >
      Delete Image
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent className="max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
    <AlertDialogHeader className="space-y-4">
      <AlertDialogTitle className="text-2xl font-bold text-gray-900">
        Confirm Deletion
      </AlertDialogTitle>
      <AlertDialogDescription className="text-gray-600">
        This will permanently delete this image and cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <AlertDialogCancel className="mt-0 rounded-lg border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-500 cursor-pointer">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-red-600 hover:to-red-700 focus-visible:ring-red-500 disabled:opacity-70 cursor-pointer"
        onClick={() =>
          startTransition(async () => {
            const res = await deleteImage(imageId);
            if (res.success) router.push("/");
          })
        }
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Deleting...
          </span>
        ) : (
          "Delete Permanently"
        )}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  );
};
