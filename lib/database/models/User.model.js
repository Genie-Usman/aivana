import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: false },
    photo: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    planId: { type: Number, default: 1 },
    creditBalance: { type: Number, default: 2 },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
