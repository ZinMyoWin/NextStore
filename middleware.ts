// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Allow specific origins
  const allowedOrigins = [
    "https://nextjs-ecommerce-app-theta.vercel.app",
    "http://localhost:3000",
  ];
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true"); // Allow credentials if needed
  }

  // Set CORS headers
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: response.headers,
    });
  }

  return response;
}

// Apply middleware to specific paths (optional)
export const config = {
  matcher: "/api/:path*", // Apply to all API routes
};
