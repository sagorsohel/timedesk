"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { startTrackingApi, getProjects, stopTrackingApi, getProjectHistoryApi } from "@/actions/projectActions";

export default function ProjectTimer() {
    const token = localStorage.getItem("token") as string;
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        async function fetchProjects() {
            const res = await getProjects(token);
            if (res.success) setProjects(res.projects);
        }
        fetchProjects();
    }, [token]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime) {
            timer = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime]);

    async function handleStart() {
        if (!selectedProject) return alert("Select a project first");
        setLoading(true);
        const res = await startTrackingApi(selectedProject, token);
        setLoading(false);
        if (res.success) {
            setStartTime(Date.now());
            setElapsed(0);
        }
    }

    async function handleStop() {
        if (!selectedProject) return alert("Select a project first");
        if (!title.trim()) return alert("Enter a title first");
        setLoading(true);
        const res = await stopTrackingApi(selectedProject, title, token);
        setLoading(false);
        if (res.success) {
            setStartTime(null);
            setElapsed(0);
            setTitle("");
            loadHistory();
        }
    }

    async function loadHistory() {
        if (!selectedProject) return alert("Select a project first");
        const res = await getProjectHistoryApi(selectedProject, token);
        if (res.success) setHistory(res.history);
    }

    function formatTime(seconds: number) {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function getProjectNameById(id: string) {
        const project = projects.find((p) => p._id === id);
        return project ? project.name : "Unknown Project";
    }

    return (
        <Card className="w-full max-w-lg mx-auto  shadow-lg border border-gray-200">
            <CardHeader>
                <CardTitle>⏱ Project Time Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Project Select */}
                <Select onValueChange={setSelectedProject}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map((p) => (
                            <SelectItem key={p._id} value={p._id}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Timer + Title */}
                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Work title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={!startTime && !selectedProject}
                    />
                    <span className="font-mono text-lg">{formatTime(elapsed)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button onClick={handleStart} disabled={loading || startTime !== null}>
                        Start
                    </Button>
                    <Button variant={'destructive'} onClick={handleStop} disabled={loading || startTime === null}>
                        Stop
                    </Button>
                    <Button variant="outline" onClick={loadHistory}>
                        Load History
                    </Button>
                </div>

                {/* History */}
                {history?.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h3 className="font-bold text-lg">📜 History</h3>
                        {history?.slice(0, 5).map((h: any) => (
                            <div key={h._id} className="p-3 rounded-lg border bg-gray-50">
                                <p className="font-medium">{h.title}</p>
                                <p className="text-sm text-gray-700">
                                    {getProjectNameById(h.projectId)} — {new Date(h.date).toLocaleDateString()} —{" "}
                                    {Math.floor(h.duration / 60)} min
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
