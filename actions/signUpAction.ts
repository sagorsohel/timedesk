// signUpAction.ts
"use server";

import api from "@/lib/axios";

export async function signUpAction(_prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 1️⃣ Validate fields
  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: "All fields are required" };
  }

  // 2️⃣ Check password match
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  try {
    // 3️⃣ Send signup request
    const { data } = await api.post("/user/signup", {
      name,
      email,
      password,
    });

    return {
      success: true,
      message: data?.message || "Account created successfully",
      user: data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Signup failed",
    };
  }
}
