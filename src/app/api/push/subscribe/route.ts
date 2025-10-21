import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    // In a real app, you would save this subscription to a database
    // For now, we'll just log it
    console.log('Push subscription received:', subscription);
    
    // You could save to a database here:
    // await savePushSubscription(subscription);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling push subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

