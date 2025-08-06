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

export async function updateRoutineTimer(
  token: string,
  routineUpdate: {
    _id: string;
    remainingSeconds: number;

    isFinished: boolean;
  }
) {
  try {
    const { data } = await api.patch("/routines/update-timer", routineUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, routine: data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update routine",
    };
  }
}
export async function createUserRoutine(
  token: string,
  routine: {
    name: string;
    durationSeconds: number;
  }
) {
  try {
    const { data } = await api.post("/routines/create", routine, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, routine: data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create routine",
    };
  }
}
export async function deleteUserRoutine(token: string, id: string) {
  try {
    const { data } = await api.delete(`/routines/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, routine: data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create routine",
    };
  }
}
