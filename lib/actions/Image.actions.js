"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../database/mongodb";
import { handleError } from "../utils";
import User from "../database/models/User.model";
import Image from "../database/models/Image.model";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { getCldImageUrl } from "next-cloudinary"; // Ensure you have this installed

// Cloudinary Configuration (Using server-side environment variables)
cloudinary.config({
  cloud_name: "dolwtu7gc",
  api_key: "942686168379851",
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Populate user details in queries
const populateUser = (query) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId",
  });

// ADD IMAGE

export async function addImage({ image, userId, path }) {
    try {
        console.log("[DEBUG] Starting addImage function");
        console.log("[DEBUG] Input parameters:", { 
            userId, 
            path,
            image: {
                ...image,
                // Avoid logging large objects
                transformationConfig: image.transformationConfig ? "[EXISTS]" : "undefined"
            }
        });

        await connectDB();
        console.log("[DEBUG] Database connected");

        // Validate inputs
        if (!userId) throw new Error("User ID required");
        if (!image.publicId && !image.url) {
            throw new Error("Need either publicId (existing) or url (to upload)");
        }

        console.log("[DEBUG] Looking up user:", userId);
        const author = await User.findById(userId);
        if (!author) throw new Error("User not found");
        console.log("[DEBUG] User found:", author._id);

        let cloudinaryResponse = null;
        if (!image.publicId) {
            console.log("[DEBUG] Starting Cloudinary upload with URL:", image.url);
            try {
                cloudinaryResponse = await cloudinary.uploader.upload(image.url, {
                    folder: "aivana",
                    transformation: image.transformationConfig?.transforms || [],
                });
                console.log("[DEBUG] Cloudinary upload successful:", {
                    public_id: cloudinaryResponse.public_id,
                    secure_url: cloudinaryResponse.secure_url
                });
            } catch (uploadError) {
                console.error("[DEBUG] Cloudinary upload failed:", uploadError);
                throw new Error(`Cloudinary upload failed: ${uploadError.message}`);
            }

            if (!cloudinaryResponse?.secure_url || !cloudinaryResponse?.public_id) {
                throw new Error("Cloudinary upload failed! No secure URL or public ID received.");
            }
        }

        // Prepare image data for database
        const imageData = {
            title: image.title || "Untitled Image",
            publicId: cloudinaryResponse?.public_id || image.publicId,
            secureURL: cloudinaryResponse?.secure_url || image.secureURL,
            author: author._id,
            transformationType: image.transformationType || "none",
            transformationURL: cloudinaryResponse?.secure_url || "",
            ...(image.aspectRatio && { aspectRatio: image.aspectRatio }),
            ...(image.color && { color: image.color }),
            ...(image.prompt && { prompt: image.prompt }),
        };

        console.log("[DEBUG] Prepared image data for DB:", JSON.stringify(imageData, null, 2));
        
        // Check for problematic publicID casing
        if (imageData.publicID) {
            console.warn("[WARNING] Found publicID (uppercase D) in image data!");
            console.trace("Trace where this object was created");
        }

        console.log("[DEBUG] Creating image in database...");
        const newImage = await Image.create(imageData);
        console.log("[DEBUG] Image created successfully:", newImage._id);

        revalidatePath(path);
        console.log("[DEBUG] Path revalidated:", path);

        return JSON.parse(JSON.stringify(newImage));

    } catch (error) {
        console.error("[DEBUG] ❌ Error in addImage:", {
            error: error.message,
            stack: error.stack,
            inputParams: {
                userId,
                path,
                image: {
                    publicId: image?.publicId,
                    url: image?.url,
                    hasTransformationConfig: !!image?.transformationConfig
                }
            }
        });
        throw error;
    }
}

  
  
// UPDATE IMAGE (Ensuring Transformation is Applied)
export async function updateImage({ image, userId, path }) {
    try {
      console.log("Connecting to DB...");
      await connectDB();
      
      console.log("Fetching image to update...");
      const imageToUpdate = await Image.findById(image._id);
      
      if (!imageToUpdate) {
        console.error("Error: Image not found");
        throw new Error("Image not found");
      }
      
      if (imageToUpdate.author.toHexString() !== userId) {
        console.error("Error: Unauthorized update attempt");
        throw new Error("Unauthorized or image not found");
      }
  
      console.log("Generating transformed URL...");
      const transformedUrl = getCldImageUrl({
        width: image.width || 500,
        height: image.height || 500,
        src: image.publicId,
        ...image.transformationConfig, // Ensure this is valid
      });
  
      console.log("Updating image in DB...");
      const updatedImage = await Image.findByIdAndUpdate(
        image._id,
        {
          ...image,
          transformationURL: transformedUrl, // Save transformed URL
        },
        { new: true }
      );
  
      if (!updatedImage) {
        console.error("Error: Image update failed");
        throw new Error("Failed to update image");
      }
  
      console.log("Image updated successfully:", updatedImage);
  
      revalidatePath(path);
      return updatedImage;
    } catch (error) {
      console.error("Update Image Error:", error);
      handleError(error);
      return null;
    }
  }
  

// DELETE IMAGE
export async function deleteImage(imageId) {
  try {
    await connectDB();
    await Image.findByIdAndDelete(imageId);
    redirect("/"); // Redirect before error handling
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGE BY ID
export async function getImageById(imageId) {
  try {
    await connectDB();
    const image = await populateUser(Image.findById(imageId));
    if (!image) throw new Error("Image not found");

    return image;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// GET ALL IMAGES (Forcing Cloudinary to Refresh Cache)
export async function getAllImages({ limit = 9, page = 1, searchQuery = "" }) {
  try {
    await connectDB();

    let expression = "folder=aivana";
    if (searchQuery) expression += ` AND ${searchQuery}`;

    const { resources } = await cloudinary.search
      .expression(expression)
      .max_results(limit)
      .invalidate_cache(true) // Force Cloudinary to refresh results
      .execute();

    const resourceIds = resources.map((resource) => resource.public_id);

    const query = searchQuery ? { publicId: { $in: resourceIds } } : {};

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.countDocuments(query);
    const savedImages = await Image.countDocuments();

    return {
      data: images,
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
    return { data: [], totalPage: 0, savedImages: 0 };
  }
}

// GET IMAGES BY USER
export async function getUserImages({ limit = 9, page = 1, userId }) {
  try {
    await connectDB();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.countDocuments({ author: userId });

    return {
      data: images,
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
    return { data: [], totalPages: 0 };
  }
}
