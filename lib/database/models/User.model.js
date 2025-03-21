import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true }, // Ensure unique Clerk ID
    email: { type: String, required: true, unique: true }, // Email should be unique
    username: { type: String, required: false }, // Removed `unique: true`
    photo: { type: String, default: "" }, // Default empty string
    firstName: { type: String, default: "" }, // Default value
    lastName: { type: String, default: "" }, // Default value
    planId: { type: Number, default: 1 }, // Default plan
    creditBalance: { type: Number, default: 10 }, // Default credits
  },
  { timestamps: true } // Auto adds `createdAt` and `updatedAt`
);

// Use existing model if it exists to prevent re-compilation issues in Next.js
const User = models.User || model("User", UserSchema);

export default User;
