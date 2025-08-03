"use client";

import { useUser } from "@clerk/nextjs";

export function useCurrentUser() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Wait until Clerk finishes loading
  if (!isLoaded) {
    return { isSignedIn: false, user: null, isLoaded: false };
  }

  return { isSignedIn, user, isLoaded };
}
