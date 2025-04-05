import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "../../../../lib/database/mongodb";
import User from "../../../../lib/database/models/User.model";
import { createUser, updateUser, deleteUser } from "@/lib/actions/User.actions";

export async function POST(req) {
  await connectDB();

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Invalid request headers" }, { status: 400 });
  }

  const payloadBuffer = await req.arrayBuffer();
  const payloadString = Buffer.from(payloadBuffer).toString("utf-8");
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payloadString, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists", user: existingUser });
      }

      const newUser = await createUser({
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "no-email@example.com",
        username: username || `user_${id.slice(0, 6)}`,
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url || "",
      });

      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: { userId: newUser._id.toString() },
        });
      }

      return NextResponse.json({ message: "User created successfully", user: newUser });
    }

    if (eventType === "user.updated") {
      const { image_url, first_name, last_name, username } = evt.data;

      const updatedUser = await updateUser(id, {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || `user_${id.slice(0, 6)}`,
        photo: image_url || "",
      });

      return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      const deletedUser = await deleteUser(id);

      return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
    }

    return NextResponse.json({ message: "Event received but not handled" });
  } catch (error) {
    console.error(`❌ Error processing ${eventType}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
