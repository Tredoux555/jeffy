import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // In a real app, you'd check for proper authentication tokens
    // For now, we'll let the client-side handle the auth check
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}


