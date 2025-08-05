"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Routine {
  id: number;
  name: string;
  duration: string;
}

export default function RoutineManager() {
  // Default routines on load
  const [routines, setRoutines] = useState<Routine[]>([
    { id: 1, name: "Default", duration: "5 hours" },
    { id: 2, name: "Study", duration: "2 hours" },
    { id: 3, name: "Job Hunting", duration: "2 hours" },
  ]);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");

  const addRoutine = () => {
    if (name.trim() === "" || duration.trim() === "") {
      alert("Please enter both Name and Duration (e.g., 2 hours).");
      return;
    }
    const newRoutine = {
      id: Date.now(),
      name: name.trim(),
      duration: duration.trim(),
    };
    setRoutines([...routines, newRoutine]);
    setName("");
    setDuration("");
  };

  const startEditing = (routine: Routine) => {
    setEditId(routine.id);
    setEditName(routine.name);
    setEditDuration(routine.duration);
  };

  const saveEdit = () => {
    if (editName.trim() === "" || editDuration.trim() === "") {
      alert("Please enter both Name and Duration.");
      return;
    }
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === editId ? { ...r, name: editName.trim(), duration: editDuration.trim() } : r
      )
    );
    setEditId(null);
    setEditName("");
    setEditDuration("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDuration("");
  };

  const deleteRoutine = (id: number) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-md shadow-md bg-white">
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
          <Label htmlFor="duration" className="block mb-1 font-medium">
            Duration
          </Label>
          <Input
            id="duration"
            type="text"
            placeholder="e.g., 2 hours"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
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
                  aria-label="Edit duration"
                  type="text"
                  placeholder="e.g., 2 hours"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-36"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
                <p className="font-semibold">{routine.name}</p>
                <p className="text-sm text-muted-foreground">{routine.duration}</p>
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