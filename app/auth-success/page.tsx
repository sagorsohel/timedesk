'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userString = urlParams.get("user");

    if (token && userString) {
      localStorage.setItem("token", token);

      try {
        const user = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }

      router.push("/admin/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <p>Logging you in via GitHub...</p>;
}
