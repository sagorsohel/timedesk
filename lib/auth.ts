"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsSignedIn(false);
    setUser(null);
    router.push("/");  // Navigate to home page after logout
  }, [router]);

  return { isSignedIn, user, loading, logout };
}
