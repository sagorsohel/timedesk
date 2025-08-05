"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserRoutines } from "@/actions/routineAction"; // adjust your import path

interface RoutineTimer {
  id: number;
  _id?: string; // from API, optional
  name: string;
  duration: string;
  originalDurationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

function parseDurationToSeconds(duration: string): number {
  const regex =
    /(\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)?/gi;
  let totalSeconds = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = (match[2] ?? "").toLowerCase();

    switch (unit) {
      case "h":
      case "hr":
      case "hrs":
      case "hour":
      case "hours":
        totalSeconds += value * 3600;
        break;
      case "m":
      case "min":
      case "mins":
      case "minute":
      case "minutes":
        totalSeconds += value * 60;
        break;
      case "s":
      case "sec":
      case "secs":
      case "second":
      case "seconds":
        totalSeconds += value;
        break;
      default:
        // If no unit or unknown, treat as minutes
        totalSeconds += value * 60;
        break;
    }
  }
  return totalSeconds;
}

function formatToHrsMins(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function RoutineManager() {
  const [routines, setRoutines] = useState<RoutineTimer[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const intervalRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Fetch routines from API on mount
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await getUserRoutines(token);
        if (!data.routines) {
          setLoading(false);
          return;
        }

        const mapped = data.routines.map((r: any) => {
          const origSeconds =
            typeof r.originalDurationSeconds === "number" && r.originalDurationSeconds > 0
              ? r.originalDurationSeconds
              : parseDurationToSeconds(r.duration || "");

          return {
            id: r.id,
            _id: r._id,
            name: r.name,
            duration: r.duration || "",
            originalDurationSeconds: origSeconds,
            remainingSeconds: r.remainingSeconds ?? origSeconds,
            isRunning: r.isRunning ?? false,
            isFinished: r.isFinished ?? false,
          };
        });

        setRoutines(mapped);
      } catch (err) {
        console.error("Failed to load routines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();

    return () => {
      // Clear intervals on unmount
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current.clear();
    };
  }, []);

  const addRoutine = () => {
    if (name.trim() === "" || duration.trim() === "") {
      alert("Please enter both Name and Duration (e.g., 1h 30m, 90 mins)");
      return;
    }
    const seconds = parseDurationToSeconds(duration);
    if (seconds <= 0) {
      alert("Please enter a valid duration");
      return;
    }
    const newRoutine: RoutineTimer = {
      id: Date.now(),
      name: name.trim(),
      duration: duration.trim(),
      originalDurationSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: false,
      isFinished: false,
    };

    setRoutines((prev) => [...prev, newRoutine]);
    setName("");
    setDuration("");
    setShowAddForm(false);
  };

  const startTimer = (id: number) => {
    if (intervalRefs.current.has(id)) return;

    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isRunning: true, isFinished: false } : r,
      ),
    );

    const interval = setInterval(() => {
      setRoutines((prev) => {
        let changed = false;
        const updated = prev.map((r) => {
          if (r.id === id) {
            if (r.remainingSeconds <= 1) {
              clearInterval(intervalRefs.current.get(id)!);
              intervalRefs.current.delete(id);
              changed = true;
              return { ...r, remainingSeconds: 0, isRunning: false, isFinished: true };
            }
            changed = true;
            return { ...r, remainingSeconds: r.remainingSeconds - 1 };
          }
          return r;
        });
        return changed ? updated : prev;
      });
    }, 1000);

    intervalRefs.current.set(id, interval);
  };

  const stopTimer = (id: number) => {
    const iv = intervalRefs.current.get(id);
    if (iv) {
      clearInterval(iv);
      intervalRefs.current.delete(id);
    }
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, isRunning: false } : r)));
  };

  const startEditing = (routine: RoutineTimer) => {
    const timeDecreased = routine.remainingSeconds < routine.originalDurationSeconds;
    if (routine.isRunning || timeDecreased) return;

    setEditId(routine.id);
    setEditName(routine.name);
    setEditDuration(routine.duration);
  };

  const saveEdit = () => {
    if (editName.trim() === "" || editDuration.trim() === "") {
      alert("Please enter both Name and Duration.");
      return;
    }
    const seconds = parseDurationToSeconds(editDuration);
    if (seconds <= 0) {
      alert("Please enter a valid duration.");
      return;
    }
    if (editId !== null) {
      stopTimer(editId);
    }
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === editId
          ? {
              ...r,
              name: editName.trim(),
              duration: editDuration.trim(),
              originalDurationSeconds: seconds,
              remainingSeconds: seconds,
              isRunning: false,
              isFinished: false,
            }
          : r,
      ),
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
    stopTimer(id);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  // Summary totals
  const totalSeconds = routines.reduce((acc, r) => acc + r.originalDurationSeconds, 0);
  const remainingSeconds = routines.reduce((acc, r) => acc + r.remainingSeconds, 0);
  const doneSeconds = totalSeconds - remainingSeconds;

  if (loading) {
    return <div className="p-4 text-center">Loading routines...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-md shadow-md bg-white">
      <h1 className="text-2xl font-semibold mb-4">Routine Manager</h1>

      {!showAddForm && (
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)}>Add New Routine</Button>
        </div>
      )}

      {showAddForm && (
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
              disabled={editId !== null}
            />
          </div>

          <div>
            <Label htmlFor="duration" className="block mb-1 font-medium">
              Duration
            </Label>
            <Input
              id="duration"
              type="text"
              placeholder="e.g., 1h 30m, 90 mins"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={editId !== null}
            />
          </div>

          <div className="flex items-end gap-2 mt-2 sm:mt-0">
            <Button onClick={addRoutine}>Add</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {routines.length === 0 ? (
        <p className="text-center text-muted-foreground">No routines added yet.</p>
      ) : (
        <ul className="space-y-4">
          {routines.map((routine) => {
            const timeDecreased =
              routine.remainingSeconds < routine.originalDurationSeconds;
            const canEdit = !routine.isRunning && !timeDecreased;
            const done = routine.isFinished || routine.remainingSeconds === 0;

            return (
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
                      placeholder="e.g., 1h 30m, 90 mins"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-36"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow">
                    <p className="font-semibold">{routine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatToHrsMins(routine.remainingSeconds)}
                    </p>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(routine)}
                        disabled={!canEdit}
                        title={
                          !canEdit
                            ? routine.isRunning
                              ? "Stop timer before editing"
                              : "Cannot edit after timer started decrementing"
                            : undefined
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteRoutine(routine.id)}
                        disabled={routine.isRunning}
                        title={routine.isRunning ? "Stop timer before deleting" : undefined}
                      >
                        Delete
                      </Button>
                      {routine.isRunning ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => stopTimer(routine.id)}
                        >
                          Stop
                        </Button>
                      ) : done ? (
                        <Button size="sm" disabled>
                          Done
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => startTimer(routine.id)}>
                          Start
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-8 border-t pt-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p>
          <strong>Total Time:</strong> {formatToHrsMins(totalSeconds)}
        </p>
        <p>
          <strong>Remaining Time:</strong> {formatToHrsMins(remainingSeconds)}
        </p>
        <p>
          <strong>Done Time:</strong> {formatToHrsMins(doneSeconds)}
        </p>
      </div>
    </div>
  );
}