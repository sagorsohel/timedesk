// lib/actions/projectAction.ts
"use server";

import api from "@/lib/axios";

export async function createProjectApi(
  token: string,
  project: {
    name: string;
    description?: string;
    amount?: number;
    tags?: string[];
  }
) {
  try {
    const { data } = await api.post("/projects/create", project, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, project: data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create project",
    };
  }
}

export async function updateProjectApi(
  token: string,
  projectId: string,
  projectUpdate: {
    name?: string;
    description?: string;
    amount?: number;
    tags?: string[];
  }
) {
  try {
    const { data } = await api.patch(
      `/projects/update/${projectId}`,
      projectUpdate,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, project: data.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update project",
    };
  }
}
