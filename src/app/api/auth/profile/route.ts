import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { firstName, lastName, email, phone } = await request.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Read users from file
    const usersPath = path.join(process.cwd(), "data", "users.json");
    let users = [];

    try {
      const usersData = await readFile(usersPath, "utf8");
      users = JSON.parse(usersData);
    } catch (error) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 });
    }

    // Find user by ID
    const userIndex = users.findIndex((u: any) => u.id === decoded.userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is already taken by another user
    const existingUser = users.find((u: any) => u.email === email && u.id !== decoded.userId);
    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 409 });
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
      email,
      phone: phone || "",
      updatedAt: new Date().toISOString(),
    };

    // Save users back to file
    await writeFile(usersPath, JSON.stringify(users, null, 2));

    // Return updated user data (without password)
    const { password: _, ...userWithoutPassword } = users[userIndex];
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

