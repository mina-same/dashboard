import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isRootRoute = createRouteMatcher(['/']); // Match the root route

export default clerkMiddleware((auth, req) => {
  const userRole = auth().sessionClaims?.metadata?.role; // Get the user role from session claims

  // Allow access to the sign-in page for all users, regardless of role
  if (req.nextUrl.pathname === '/sign-in') {
    return NextResponse.next(); // Proceed without redirection
  }

  // Block non-admin users from accessing the root route
  if (isRootRoute(req) && userRole !== 'admin') {
    const url = new URL('/NotAdmin', req.url); // Redirect to NotAdmin page
    return NextResponse.redirect(url);
  }

  // Optionally add other route protection logic here
  return NextResponse.next(); // Proceed with the request if no redirection is needed
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
