"use server";

import api from "@/lib/axios";

export async function getProjects(
  token: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[]; // array of tag strings
  }
) {
  try {
    const params: any = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.search) params.search = options.search;
    if (options?.tags?.length) params.tags = options.tags.join(",");

    const { data } = await api.get("/projects/get", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });



    // Backend response: { success, message, data: { projects, pagination } }
    return {
      success: true,
      projects: data.data.projects,
      pagination: data.data.pagination,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch projects",
      projects: [],
      pagination: null,
    };
  }
}

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
