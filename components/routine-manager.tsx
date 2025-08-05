"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Routine {
  id: number;
  name: string;
  duration: string;
}

interface RoutineTimer extends Routine {
  originalDurationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

function parseDurationToSeconds(duration: string): number {
  const regex =
    /(\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)?/gi;
  let totalSeconds = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2]?.toLowerCase() ?? "s";

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
      default:
        totalSeconds += value;
        break;
    }
  }

  if (totalSeconds === 0) {
    const onlyNum = parseInt(duration);
    if (!isNaN(onlyNum)) totalSeconds = onlyNum * 60;
  }

  return totalSeconds;
}

function formatToHrsMins(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function RoutineManager() {
  const [routines, setRoutines] = useState<RoutineTimer[]>(() => {
    const defaults = [
      { id: 1, name: "Default", duration: "5 hours" },
      { id: 2, name: "Study", duration: "2 hours" },
      { id: 3, name: "Job Hunting", duration: "2 hours" },
    ];
    return defaults.map((r) => {
      const seconds = parseDurationToSeconds(r.duration);
      return {
        ...r,
        originalDurationSeconds: seconds,
        remainingSeconds: seconds,
        isRunning: false,
      };
    });
  });

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const intervalRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      intervalRefs.current.forEach((interval) => clearInterval(interval));
      intervalRefs.current.clear();
    };
  }, []);

  const addRoutine = () => {
    if (name.trim() === "" || duration.trim() === "") {
      alert("Please enter both Name and Duration (e.g., 1h 30m, 90 mins, 2 hours).");
      return;
    }
    const seconds = parseDurationToSeconds(duration);
    if (seconds <= 0) {
      alert("Please enter a valid duration.");
      return;
    }

    const newRoutine: RoutineTimer = {
      id: Date.now(),
      name: name.trim(),
      duration: duration.trim(),
      originalDurationSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: false,
    };
    setRoutines((prev) => [...prev, newRoutine]);
    setName("");
    setDuration("");
    setShowAddForm(false);
  };

  const startTimer = (id: number) => {
    if (intervalRefs.current.has(id)) return;

    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRunning: true } : r))
    );

    const interval = setInterval(() => {
      setRoutines((oldRoutines) => {
        return oldRoutines.map((routine) => {
          if (routine.id === id) {
            if (routine.remainingSeconds <= 1) {
              clearInterval(intervalRefs.current.get(id)!);
              intervalRefs.current.delete(id);
              return { ...routine, remainingSeconds: 0, isRunning: false };
            }
            return { ...routine, remainingSeconds: routine.remainingSeconds - 1 };
          }
          return routine;
        });
      });
    }, 1000);

    intervalRefs.current.set(id, interval);
  };

  const stopTimer = (id: number) => {
    const interval = intervalRefs.current.get(id);
    if (interval) {
      clearInterval(interval);
      intervalRefs.current.delete(id);
    }
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRunning: false } : r))
    );
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
            }
          : r
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
    stopTimer(id);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  // Calculate totals
  const totalSeconds = routines.reduce((acc, r) => acc + r.originalDurationSeconds, 0);
  const remainingSeconds = routines.reduce((acc, r) => acc + r.remainingSeconds, 0);
  const doneSeconds = totalSeconds - remainingSeconds;

  return (
    <div className="min-w-[35rem] mx-auto mt-10 p-6 border rounded-md shadow-md bg-white">
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
              placeholder="e.g., 1h 30m, 90 mins, 2 hours"
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

      {routines.length === 0 && (
        <p className="text-center text-muted-foreground">No routines added yet.</p>
      )}

      <ul className="space-y-4">
        {routines.map((routine) => {
          const timeDecreased =
            routine.remainingSeconds < routine.originalDurationSeconds;
          const canEdit = !routine.isRunning && !timeDecreased;
          const done = routine.remainingSeconds === 0;

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
                    placeholder="e.g., 1h 30m, 90 mins, 2 hours"
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

      {/* Summary Section */}
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