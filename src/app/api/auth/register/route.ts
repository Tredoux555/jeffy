import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "First name, last name, email, and password are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Read existing users
    const usersPath = path.join(process.cwd(), "data", "users.json");
    let users = [];

    try {
      const usersData = await readFile(usersPath, "utf8");
      users = JSON.parse(usersData);
    } catch (error) {
      // If file doesn't exist, start with empty array
      users = [];
    }

    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName,
      lastName,
      email,
      phone: phone || "",
      password: hashedPassword,
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      preferences: {
        newsletter: false,
        notifications: true,
      },
      addresses: [],
      orders: [],
    };

    // Add user to array
    users.push(newUser);

    // Save users back to file
    await writeFile(usersPath, JSON.stringify(users, null, 2));

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

