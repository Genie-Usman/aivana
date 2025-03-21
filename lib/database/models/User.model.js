import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
      clerkId: { type: String, required: true }, // Remove unique: true
      email: { type: String, required: true }, // Remove unique: true
      username: { type: String, required: false },
      photo: { type: String, default: "" },
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      planId: { type: Number, default: 1 },
      creditBalance: { type: Number, default: 10 },
    },
    { timestamps: true }
  );

// Use existing model if it exists to prevent re-compilation issues in Next.js
const User = models.User || model("User", UserSchema);

export default User;
