import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Read orders
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    let orders = [];

    try {
      const ordersData = await readFile(ordersPath, "utf8");
      orders = JSON.parse(ordersData);
    } catch (error) {
      return NextResponse.json({ error: "Orders not found" }, { status: 404 });
    }

    // Find the specific order
    const order = orders.find((o: any) => o.id === id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user owns this order
    if (order.userId !== decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

