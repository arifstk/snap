// // src/proxy.ts
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Define Public Routes
//   const publicRoutes = ["/login", "/register", "/api/auth", "/api/webhook"];

//   if (publicRoutes.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // Get User Token
//   const token = await getToken({
//     req,
//     secret: process.env.AUTH_SECRET,
//     secureCookie: process.env.NODE_ENV === "production", //vercel
//     //vercel
//     salt:
//       process.env.NODE_ENV === "production"
//         ? "__Secure-authjs.session-token"
//         : "authjs.session-token",
//   });
//   console.log(token);
//   console.log(req.nextUrl);
//   const role = token?.role;

//   // Maintenance Mode Logic
//   const maintenanceExemptPaths = [
//     "/admin",
//     "/api",
//     "/maintenance",
//     "/_next",
//     "/favicon.ico",
//   ];

//   const isExempt = maintenanceExemptPaths.some((path) =>
//     pathname.startsWith(path),
//   );

//   // ONLY check maintenance if:
//   // - Not on an exempt path
//   // - User is NOT an admin (Admins should never see maintenance page)
//   if (!isExempt && role !== "admin") {
//     try {
//       const baseUrl = req.nextUrl.origin;
//       const res = await fetch(`${baseUrl}/api/settings`, { cache: "no-store" });

//       if (res.ok) {
//         const json = await res.json();
//         const maintenanceMode = json?.settings?.maintenanceMode ?? false;

//         if (maintenanceMode) {
//           // Allow login page even in maintenance so Admin can log in
//           if (pathname !== "/login") {
//             return NextResponse.redirect(new URL("/maintenance", req.url));
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Middleware: failed to fetch settings", error);
//     }
//   }
//   // ------------------------

//   if (!token) {
//     const loginUrl = new URL("/login", req.url);
//     loginUrl.searchParams.set("callbackUrl", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // const role = token.role;

//   // Protect /user routes — only "user" role allowed
//   if (pathname.startsWith("/user") && role !== "user") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   // Protect /delivery routes — only "deliveryBoy" role allowed
//   if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   // Protect /admin routes — only "admin" role allowed
//   if (pathname.startsWith("/admin") && role !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files and auth routes entirely
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhook") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Get User Token
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    salt:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const role = token?.role;

  // Public routes — allow unauthenticated access
  const publicRoutes = [
    "/login",
    "/register",
    "/about",
    "/contact",
    "/privacy",
    "/offer",
    "/category",
    "/maintenance",
  ];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    // If already logged in, redirect away from login/register
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Maintenance Mode — skip for admin, skip the internal fetch on every request
  const maintenanceExemptPaths = [
    "/admin",
    "/api",
    "/maintenance",
    "/_next",
    "/favicon.ico",
  ];
  const isExempt = maintenanceExemptPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!isExempt && role !== "admin") {
    try {
      const baseUrl = req.nextUrl.origin;
      const res = await fetch(`${baseUrl}/api/settings`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.settings?.maintenanceMode) {
          return NextResponse.redirect(new URL("/maintenance", req.url));
        }
      }
    } catch (error) {
      console.error("Middleware: failed to fetch settings", error);
    }
  }

  // Not authenticated — redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // use pathname only, not full URL
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/delivery") && role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
