"use client";

import React, { useState, useMemo, useActionState } from "react";
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
import { createProjectApi, updateProjectApi } from "@/actions/projectActions";

type Project = {
    _id?: string;
    name: string;
    description?: string;
    tags: string[];
    amount?: number;
    timeTrackedSeconds: number;
    createdAt: Date;
};

const ALL_TAGS = [
    { label: "frontend", color: "blue" },
    { label: "backend", color: "green" },
    { label: "app", color: "orange" },
];

export default function ProjectsTableWithSheet() {
    const [projects, setProjects] = useState<Project[]>([
        {
            _id: "1",
            name: "Project Alpha",
            description: "Frontend work on homepage",
            tags: ["frontend", "app"],
            amount: 1200,
            timeTrackedSeconds: 5400,
            createdAt: new Date("2025-08-01"),
        },
        {
            _id: "2",
            name: "Project Beta",
            description: "Backend API development",
            tags: ["backend"],
            amount: 2500,
            timeTrackedSeconds: 3600,
            createdAt: new Date("2025-08-05"),
        },
    ]);

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        const token = localStorage.getItem('token') as string


        const payload: Project = {
            _id: editingProject ? editingProject._id : "",
            name: formName,
            description: formData.get("description")?.toString() || "",
            amount: formData.get("amount") ? Number(formData.get("amount")) : 0,
            tags: tags,
            timeTrackedSeconds: editingProject?.timeTrackedSeconds || 0,
            createdAt: editingProject?.createdAt || new Date(),
        };



        try {



            if (editingProject) {
                // Update existing
                const { project } = await updateProjectApi(token, editingProject?._id as string, payload);
                setProjects((prev) =>
                    prev.map((p) => (p._id === editingProject._id ? project : p))
                );
            } else {
                // Create new
                const { project } = await createProjectApi(token, payload);
                setProjects((prev) => [project, ...prev]);
            }

            setSheetOpen(false);
            return null; // No error
        } catch (error) {
            console.error("Error saving project:", error);
            return "Something went wrong while saving the project.";
        }
    };


    const [error, saveAction, isSaving] = useActionState(handleSaveProject, null);

    const confirmDeleteProject = (project: Project) => {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = () => {
        if (projectToDelete) {
            setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
            setProjectToDelete(null);
        }
        setDeleteDialogOpen(false);
    };

    const toggleTag = (tag: string) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const toggleFilterTag = (tag: string) => {
        setFilterTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
        setCurrentPage(1);
    };

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const search = searchText.trim().toLowerCase();
            if (
                search &&
                !(
                    project.name.toLowerCase().includes(search) ||
                    project.description?.toLowerCase().includes(search)
                )
            ) {
                return false;
            }
            if (filterTags.length > 0) {
                if (!project.tags.some((tag) => filterTags.includes(tag))) return false;
            }
            if (filterStartDate) {
                const start = new Date(filterStartDate);
                if (project.createdAt < start) return false;
            }
            if (filterEndDate) {
                const end = new Date(filterEndDate);
                end.setHours(23, 59, 59, 999);
                if (project.createdAt > end) return false;
            }
            return true;
        });
    }, [projects, searchText, filterTags, filterStartDate, filterEndDate]);

    const pageCount = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page: number) => {
        if (page < 1) page = 1;
        else if (page > pageCount) page = pageCount;
        setCurrentPage(page);
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
                        setCurrentPage(1);
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
                        setCurrentPage(1);
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
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No projects found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProjects.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell>{project.description}</TableCell>
                                    <TableCell className="flex space-x-1">
                                        {project.tags.map((tag) => {
                                            const tagData = ALL_TAGS.find((t) => t.label === tag);
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
                                    <TableCell>${project.amount ?? 0}</TableCell>
                                    <TableCell>{formatTime(project.timeTrackedSeconds)}</TableCell>
                                    <TableCell>{project.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditProjectSheet(project)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => confirmDeleteProject(project)}
                                        >
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
            {pageCount > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Button>
                    {[...Array(pageCount)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
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
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === pageCount}
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

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSheetOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving
                                    ? "Saving..."
                                    : editingProject
                                        ? "Update"
                                        : "Create"}
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
