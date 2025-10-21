import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
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

    const orderData = await request.json();

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    if (!orderData.shippingInfo) {
      return NextResponse.json({ error: "Shipping information required" }, { status: 400 });
    }

    // Create order
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: decoded.userId,
      items: orderData.items,
      total: orderData.total,
      tax: orderData.total * 0.08,
      shipping: 0, // Free shipping
      finalTotal: orderData.total * 1.08,
      shippingInfo: orderData.shippingInfo,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: null,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    };

    // Read existing orders
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    let orders = [];

    try {
      const ordersData = await readFile(ordersPath, "utf8");
      orders = JSON.parse(ordersData);
    } catch (error) {
      // If file doesn't exist, start with empty array
      orders = [];
    }

    // Add new order
    orders.push(order);

    // Save orders back to file
    await writeFile(ordersPath, JSON.stringify(orders, null, 2));

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.finalTotal,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    // Read orders
    const ordersPath = path.join(process.cwd(), "data", "orders.json");
    let orders = [];

    try {
      const ordersData = await readFile(ordersPath, "utf8");
      orders = JSON.parse(ordersData);
    } catch (error) {
      return NextResponse.json({ orders: [] });
    }

    // Filter orders for the user
    const userOrders = orders.filter((order: any) => order.userId === decoded.userId);

    return NextResponse.json({ orders: userOrders });

  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

