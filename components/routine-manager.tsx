"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Input,
    
} from "@/components/ui/input";

// You may need to adapt imports based on your shadcn/ui setup (for Label, Input)
import { cn } from "@/lib/utils"; // for conditional classNames, optional
import { Label } from "./ui/label";

interface Routine {
    id: number;
    name: string;
    time: string;
}

export default function RoutineManager() {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [name, setName] = useState("");
    const [time, setTime] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editTime, setEditTime] = useState("");

    const addRoutine = () => {
        if (name.trim() === "" || time.trim() === "") {
            alert("Please enter both Name and Time.");
            return;
        }
        const newRoutine = {
            id: Date.now(),
            name: name.trim(),
            time: time.trim(),
        };
        setRoutines([...routines, newRoutine]);
        setName("");
        setTime("");
    };

    const startEditing = (routine: Routine) => {
        setEditId(routine.id);
        setEditName(routine.name);
        setEditTime(routine.time);
    };

    const saveEdit = () => {
        if (editName.trim() === "" || editTime.trim() === "") {
            alert("Please enter both Name and Time.");
            return;
        }
        setRoutines((prev) =>
            prev.map((r) =>
                r.id === editId ? { ...r, name: editName.trim(), time: editTime.trim() } : r
            )
        );
        setEditId(null);
        setEditName("");
        setEditTime("");
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
        setEditTime("");
    };

    const deleteRoutine = (id: number) => {
        setRoutines((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border rounded-md shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Routine Manager</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="col-span-2">
                    <Label htmlFor="name" className="block mb-1 font-medium">
                        Name
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Routine name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="time" className="block mb-1 font-medium">
                        Time
                    </Label>
                    <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            </div>

            <Button onClick={addRoutine} className="mb-6 w-full sm:w-auto">
                Add
            </Button>

            {routines.length === 0 && (
                <p className="text-center text-muted-foreground">No routines added yet.</p>
            )}

            <ul className="space-y-4">
                {routines.map((routine) => (
                    <li
                        key={routine.id}
                        className="border rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between"
                    >
                        {editId === routine.id ? (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-grow">
                                <Input
                                    aria-label="Edit name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-grow"
                                />
                                <Input
                                    aria-label="Edit time"
                                    type="time"
                                    value={editTime}
                                    onChange={(e) => setEditTime(e.target.value)}
                                    className="w-28"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
                                <p className="font-semibold">{routine.name}</p>
                                <p className="text-sm text-muted-foreground">{routine.time}</p>
                            </div>
                        )}

                        <div className="flex gap-2 mt-3 sm:mt-0">
                            {editId === routine.id ? (
                                <>
                                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={saveEdit}>
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => startEditing(routine)}>
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => deleteRoutine(routine.id)}>
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}