import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If not logged in and trying to access /admin/dashboard
  if (!userId && req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const signInUrl = new URL("/sign-in", req.url); // redirect to /sign-in
    signInUrl.searchParams.set("redirect_url", req.url); // optional: redirect back after sign in
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/dashboard(.*)", // Protect this path
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
