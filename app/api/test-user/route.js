import { NextResponse } from "next/server";
import { createUser } from "../../../lib/actions/User.actions";

export async function GET() {
  const testUser = {
    clerkId: "test123",
    email: "test@example.com",
    username: "testuser",
    firstName: "Test",
    lastName: "User",
    photo: "",
  };

  console.log("🚀 Testing createUser...");
  const result = await createUser(testUser);
  console.log("📌 createUser result:", result);

  return NextResponse.json(result || { error: "User creation failed" });
}
