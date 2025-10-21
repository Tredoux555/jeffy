import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Read users from file
    const usersPath = path.join(process.cwd(), "data", "users.json");
    let users = [];

    try {
      const usersData = await readFile(usersPath, "utf8");
      users = JSON.parse(usersData);
    } catch (error) {
      // If file doesn't exist, return error
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Find user by email
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role || "customer"
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

