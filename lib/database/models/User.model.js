import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: false }, // Not unique
  photo: { type: String, default: "" }, // Default to empty string
  firstName: { type: String, default: "" }, // Default value
  lastName: { type: String, default: "" }, // Default value
  planId: { type: Number, default: 1 },
  creditBalance: { type: Number, default: 10 },
});

const User = models?.User || model("User", UserSchema);

export default User;
