"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/User.model";
import { connectDB } from "../database/mongodb";
import { handleError } from "../utils";

// CREATE USER

export async function createUser(userData) {
  try {
    const existingUser = await User.findOne({ clerkId: userData.clerkId });

    if (existingUser) {
      console.log("⚠️ User with this Clerk ID already exists:", existingUser);
      return null; // Return null to indicate no new user was created
    }

    const newUser = new User(userData);
    await newUser.save(); // Use `save()` for better error handling
    console.log("✅ New User Created:", newUser);
    return newUser;
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw error;
  }
}


// READ USER
export async function getUserById(userId) {
  try {
    console.log("🔍 Fetching user by Clerk ID:", userId);
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      console.warn("⚠️ User not found for Clerk ID:", userId);
      return null;
    }

    console.log("✅ User found:", user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return null;
  }
}

// UPDATE USER
export async function updateUser(clerkId, user) {
  try {
    console.log("🔄 Updating user with Clerk ID:", clerkId, "Data:", user);
    await connectDB();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) {
      console.warn("⚠️ User update failed for Clerk ID:", clerkId);
      return null;
    }

    console.log("✅ User updated successfully:", updatedUser);
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return null;
  }
}

// DELETE USER
export async function deleteUser(clerkId) {
  try {
    console.log("🗑️ Attempting to delete user with Clerk ID:", clerkId);
    await connectDB();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      console.warn("⚠️ User not found for deletion:", clerkId);
      return null;
    }

    console.log("✅ User found, deleting:", userToDelete);
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return null;
  }
}

// UPDATE USER CREDITS
export async function updateCredits(userId, creditFee) {
  try {
    console.log("💳 Updating credits for User ID:", userId, "Credit Fee:", creditFee);
    await connectDB();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if (!updatedUserCredits) {
      console.warn("⚠️ User credits update failed for User ID:", userId);
      return null;
    }

    console.log("✅ User credits updated successfully:", updatedUserCredits);
    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    console.error("❌ Error updating credits:", error);
    return null;
  }
}
