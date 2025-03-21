import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "../../../../lib/database/mongodb";
import User from "../../../../lib/database/models/User.model"; // Import Mongoose User model
import { createUser, updateUser, deleteUser } from "@/lib/actions/User.actions";


export async function POST(req) {
  console.log("📩 Incoming webhook request...");

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET is missing!");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers.");
    return NextResponse.json({ error: "Invalid headers" }, { status: 400 });
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
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  console.log("✅ Webhook verified:", evt.type, evt.data);

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      console.log(`🆕 Handling user.created event for Clerk ID: ${id}`);

      const {id, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "no-email@example.com",
        username: username || `user_${id.slice(0, 6)}`,
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url || "",
      };

      const newUser = await createUser(user);

      if (!newUser) {
        console.log("⚠️ User was NOT created (already exists?)");
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }

      console.log("✅ User successfully created:", newUser);

      return NextResponse.json({ message: "User created", user: newUser });
    }

    if (eventType === "user.updated") {
      console.log(`✏️ Handling user.updated event for Clerk ID: ${id}`);

      const { image_url, first_name, last_name, username } = evt.data;
      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || `user_${id.slice(0, 6)}`,
        photo: image_url || "",
      };

      const updatedUser = await updateUser(id, user);
      console.log("✅ User updated:", updatedUser);
      return NextResponse.json({ message: "User updated", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      console.log(`🗑️ Handling user.deleted event for Clerk ID: ${id}`);

      const deletedUser = await deleteUser(id);
      console.log("✅ User deleted:", deletedUser);
      return NextResponse.json({ message: "User deleted", user: deletedUser });
    }

    console.log(`⚠️ Unhandled event type: ${eventType}`);
    return NextResponse.json({ message: "Unhandled event" });
  } catch (error) {
    console.error(`❌ Error processing ${eventType}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

