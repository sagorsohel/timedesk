// loginAction.ts
"use server";

import api from "@/lib/axios";

export async function loginAction(_prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const { data } = await api.post("/user/login", { email, password });
    

    return { success: true, message: data?.message, token: data?.data?.token, user: data?.data?.userData };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
}
