"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DeleteDialog from "@/components/delete-dialog";
import { Trash2, Edit } from "lucide-react";
import { createProjectApi, getProjects, updateProjectApi } from "@/actions/projectActions";
import { toast } from "sonner";
import { useActionState } from "react"; // Assuming you are using new React 19 hook

type Project = {
    _id?: string;
    name: string;
    description?: string;
    tags: string[];
    amount?: number;
    totalTrackedTime: number;
    createdAt: Date;
};

type Pagination = {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
};

const ALL_TAGS = [
    { label: "frontend", color: "blue" },
    { label: "backend", color: "green" },
    { label: "app", color: "orange" },
];

export default function ProjectsTableWithSheet() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sheet states
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    // Filters
    const [searchText, setSearchText] = useState("");
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    // Pagination
    const itemsPerPage = 10;

    const fetchProjects = async (page: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token") as string;
            const { projects: fetchedProjects, pagination: apiPagination } = await getProjects(token, {
                page,
                limit: itemsPerPage,
                search: searchText,
                tags: filterTags,
                // startDate: filterStartDate,
                // endDate: filterEndDate,
            });
            setProjects(fetchedProjects);
            setPagination(apiPagination);
        } catch (err: any) {
            setError(err.message || "Failed to fetch projects");
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filters or page change
    useEffect(() => {
        fetchProjects(pagination.page);
    }, [pagination.page, searchText, filterTags, filterStartDate, filterEndDate]);

    function formatTime(seconds: number) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    }

    const openNewProjectSheet = () => {
        setEditingProject(null);
        setName("");
        setDescription("");
        setAmount("");
        setTags([]);
        setSheetOpen(true);
    };

    const openEditProjectSheet = (project: Project) => {
        setEditingProject(project);
        setName(project.name);
        setDescription(project.description || "");
        setAmount(project.amount?.toString() || "");
        setTags(project.tags);
        setSheetOpen(true);
    };

    // Save with useActionState
    const handleSaveProject = async (_: any, formData: FormData) => {
        const formName = formData.get("name")?.toString().trim();
        if (!formName) return "Project name is required";
        const token = localStorage.getItem("token") as string;

        const payload: Project = {
            _id: editingProject ? editingProject._id : "",
            name: formName,
            description: formData.get("description")?.toString() || "",
            amount: formData.get("amount") ? Number(formData.get("amount")) : 0,
            tags: tags,
            totalTrackedTime: editingProject?.totalTrackedTime || 0,
            createdAt: editingProject?.createdAt || new Date(),
        };


        try {
            if (editingProject) {
                // Update existing
                const { project, success } = await updateProjectApi(token, editingProject._id as string, payload);
                if (success) {
                    setProjects((prev) => prev.map((p) => (p._id === editingProject._id ? project : p)));
                    toast.success("Project updated successfully!")
                    fetchProjects(1);

                }


            } else {
                // Create new
                const { project, success } = await createProjectApi(token, payload);
                if (success) {
                    toast.success("Project created successfully!");
                    fetchProjects(1); // Refetch first page after creating

                }
            }
            setSheetOpen(false);
            return null; // No error
        } catch (error) {
            console.error("Error saving project:", error);
            return "Something went wrong while saving the project.";
        }
    };

    const [saveError, saveAction, isSaving] = useActionState(handleSaveProject, null);

    const confirmDeleteProject = (project: Project) => {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (projectToDelete) {
            setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
            setProjectToDelete(null);
        }
        setDeleteDialogOpen(false);
        fetchProjects(pagination.page); // Refetch after delete
    };

    const toggleTag = (tag: string) => {
        setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    const toggleFilterTag = (tag: string) => {
        setFilterTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
        setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
    };

    const goToPage = (page: number) => {
        if (page < 1) page = 1;
        else if (page > pagination.totalPages) page = pagination.totalPages;
        setPagination((prev) => ({ ...prev, page }));
    };

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Button onClick={openNewProjectSheet}>Create Project</Button>
            </div>

            {/* Filter bar */}
            <div className="mb-6 p-4 border rounded-lg shadow-sm flex flex-wrap items-center gap-4">
                <Input
                    type="search"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="max-w-xs"
                />
                <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-semibold mr-2">Filter Tags:</span>
                    {ALL_TAGS.map(({ label, color }) => (
                        <Button
                            key={label}
                            size="sm"
                            variant={filterTags.includes(label) ? "default" : "outline"}
                            onClick={() => toggleFilterTag(label)}
                            className={`border-${color}-600`}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setSearchText("");
                        setFilterTags([]);
                        setFilterStartDate("");
                        setFilterEndDate("");
                        setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="ml-auto"
                >
                    Clear Filters
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Time Tracked</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects?.map((project, index) => (
                                <TableRow key={index}>
                                    <TableCell>{project?.name}</TableCell>
                                    <TableCell>{project?.description}</TableCell>
                                    <TableCell className="flex space-x-1">
                                        {project?.tags?.map((tag) => {
                                            const tagData = ALL_TAGS?.find((t) => t?.label === tag);
                                            return (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className={`text-${tagData?.color}-600 border-${tagData?.color}-600`}
                                                >
                                                    {tag}
                                                </Badge>
                                            );
                                        })}
                                    </TableCell>
                                    <TableCell>${project?.amount ?? 0}</TableCell>
                                    <TableCell>{formatTime(project?.totalTrackedTime)}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditProjectSheet(project)}>
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => confirmDeleteProject(project)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        Prev
                    </Button>
                    {[...Array(pagination.totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <Button
                                key={page}
                                variant={page === pagination.page ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        );
                    })}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Sheet for create/edit */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="max-w-md p-6" side="right">
                    <DialogTitle className="text-xl font-semibold mb-4">
                        {editingProject ? "Edit Project" : "Create Project"}
                    </DialogTitle>

                    <form action={saveAction} className="space-y-4">
                        <Input
                            name="name"
                            placeholder="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Textarea
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                        <Input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min={0}
                        />

                        <div>
                            <label className="block mb-1 font-medium">Tags</label>
                            <div className="flex space-x-2">
                                {ALL_TAGS.map(({ label, color }) => (
                                    <Button
                                        type="button"
                                        key={label}
                                        size="sm"
                                        variant={tags.includes(label) ? "default" : "outline"}
                                        onClick={() => toggleTag(label)}
                                        className={`border-${color}-600`}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {saveError && <p className="text-red-500 text-sm">{saveError}</p>}

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving..." : editingProject ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                itemName={projectToDelete?.name}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirmed}
            />
        </div>
    );
}
