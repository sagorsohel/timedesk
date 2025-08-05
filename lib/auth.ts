// lib/auth.ts or utils/useAuth.ts
"use client";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    setIsSignedIn(!!token);

    try {
      const parsedUser = userData && userData !== "undefined" ? JSON.parse(userData) : null;
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setUser(null);
    }

    setLoading(false);
  }, []);

  return { isSignedIn, user, loading };
}
