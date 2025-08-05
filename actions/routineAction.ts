// lib/actions/routineAction.ts
"use server";

import api from "@/lib/axios";

export async function getUserRoutines(token: string) {
  try {
    const { data } = await api.get("/routines/get-routines", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const routines = data?.data?.[0]?.routines ?? [];

    return {
      success: true,
      routines,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch routines",
    };
  }
}
