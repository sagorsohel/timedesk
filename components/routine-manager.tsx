"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createUserRoutine,
  deleteUserRoutine,
  getUserRoutines,
  updateRoutineTimer,
} from "@/actions/routineAction";
import { toast } from "sonner";
import { SummaryCard } from "./dashboard/summary-card";


// Parses durations like "1h 30m", "90 mins", or plain numbers to seconds
export function parseDurationToSeconds(duration: string): number {
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

// Formats seconds always including seconds (important to show countdown)
export function formatToHrsMins(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  let result = "";
  if (h > 0) result += `${h}h `;
  if (m > 0 || h > 0) result += `${m}m `;
  result += `${s}s`;
  return result.trim();
}

interface RoutineTimer {
  id: number; // numeric client id
  _id?: string; // API string id if available
  name: string;
  duration: string;
  originalDurationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
}


export default function RoutineManager() {
  const [routines, setRoutines] = useState<RoutineTimer[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [durationAsMin, setDurationAsMin] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const intervalRefs = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    async function fetchRoutines() {
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
      } catch (e) {
        console.error("Failed to fetch routines:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchRoutines();

    return () => {
      intervalRefs.current.forEach(clearInterval);
      intervalRefs.current.clear();
    };
  }, []);

  async function callUpdateRoutineTimerAPI(routine: RoutineTimer, isFinished: boolean) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found to update routine timer");
      return;
    }
    try {
      const token = localStorage.getItem("token") as string;
      await updateRoutineTimer(token, {
        _id: (routine._id ?? routine.id).toString(),
        remainingSeconds: routine.remainingSeconds,
        isFinished,
      });
    } catch (err) {
      console.error("Failed to update routine timer API", err);
    }
  }

  const addRoutine = async () => {
    if (!name.trim() || (!duration.trim() && !durationAsMin.trim())) {
      alert("Please enter both Name and Hours/Minutes");
      return;
    }

    // Parse hours and minutes:
    const hoursInSeconds = parseInt(duration) > 0 ? parseInt(duration) * 3600 : 0;
    const minutesInSeconds = parseInt(durationAsMin) > 0 ? parseInt(durationAsMin) * 60 : 0;
    const totalDuration = hoursInSeconds + minutesInSeconds;

    if (totalDuration <= 0) {
      alert("Invalid duration");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      await createUserRoutine(token, {
        name: name.trim(),
        durationSeconds: totalDuration,
      });
      toast.success("Routine has been created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create routine");
    }

    const newRoutine: RoutineTimer = {
      id: Date.now(),
      name: name.trim(),
      duration: `${duration}h ${durationAsMin}m`.trim(),
      originalDurationSeconds: totalDuration,
      remainingSeconds: totalDuration,
      isRunning: false,
      isFinished: false,
    };
    setRoutines((prev) => [...prev, newRoutine]);
    setName("");
    setDuration("");
    setDurationAsMin("");
    setShowAddForm(false);
  };

  const startTimer = (id: number) => {
    if (intervalRefs.current.has(id)) return;

    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRunning: true, isFinished: false } : r)),
    );

    const interval = setInterval(() => {
      setRoutines((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            if (r.remainingSeconds <= 1) {
              clearInterval(intervalRefs.current.get(id)!);
              intervalRefs.current.delete(id);
              const finishedRoutine = {
                ...r,
                remainingSeconds: 0,
                isRunning: false,
                isFinished: true,
              };
              callUpdateRoutineTimerAPI(finishedRoutine, true);
              return finishedRoutine;
            }
            return { ...r, remainingSeconds: r.remainingSeconds - 1 };
          }
          return r;
        }),
      );
    }, 1000);

    intervalRefs.current.set(id, interval);
  };

  const stopTimer = async (id: number) => {
    const iv = intervalRefs.current.get(id);

    if (iv) {
      clearInterval(iv);
      intervalRefs.current.delete(id);
    }

    const routine = routines.find((r) => r.id === id);
    if (!routine) return;

    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, isRunning: false } : r)));

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token");

      await updateRoutineTimer(token, {
        _id: routine._id?.toString() ?? routine.id.toString(),
        remainingSeconds: routine.remainingSeconds,
        isFinished: routine.isFinished,
      });
    } catch (err) {
      console.error("Failed to update routine timer:", err);
    }
  };

  const startEditing = (routine: RoutineTimer) => {
    if (routine.isRunning || routine.remainingSeconds < routine.originalDurationSeconds) return;

    setEditId(routine.id);
    setEditName(routine.name);
    setEditDuration(routine.duration);
  };

  const saveEdit = () => {
    if (!editName.trim() || !editDuration.trim()) {
      alert("Please enter both Name and Duration");
      return;
    }
    const seconds = parseDurationToSeconds(editDuration);
    if (seconds <= 0) {
      alert("Invalid duration");
      return;
    }
    if (editId !== null) stopTimer(editId);

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

  const deleteRoutine = async (id: string) => {
    try {


      const token = localStorage.getItem('token')
      const data = await deleteUserRoutine(token as string, id)
      console.log(data)
      if (data?.success) {
        setRoutines((prev) => prev.filter((r) => r._id !== id));
        toast.success('Routine is Deleted!')
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!")
    }


  };

  const totalSeconds = routines.reduce((acc, r) => acc + r.originalDurationSeconds, 0);
  const remainingSeconds = routines.reduce((acc, r) => acc + r.remainingSeconds, 0);
  const doneSeconds = totalSeconds - remainingSeconds;

  if (loading) return <div className="p-4 text-center">Loading routines...</div>;

  return (
    <div className="max-w-xl mt-10 p-6 border rounded-md shadow-md ">
      <div className="">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-4">Routine Manager</h1>
          {!showAddForm && (
            <div className="mb-6">
              <Button onClick={() => setShowAddForm(true)}>Add New Routine</Button>
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 pb-8 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <SummaryCard label="Total Time" value={formatToHrsMins(totalSeconds)} />
          <SummaryCard label="Remaining Time" value={formatToHrsMins(remainingSeconds)} />
          <SummaryCard label="Done Time" value={formatToHrsMins(doneSeconds)} />
        </div>
      </div>



      {showAddForm && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div>
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
              Hours
            </Label>
            <Input
              id="duration"
              type="number"
              min={0}
              placeholder="e.g., 1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={editId !== null}
            />
          </div>
          <div>
            <Label htmlFor="durationAsMin" className="block mb-1 font-medium">
              Minutes
            </Label>
            <Input
              id="durationAsMin"
              type="number"
              min={0}
              max={59}
              placeholder="e.g., 30"
              value={durationAsMin}
              onChange={(e) => setDurationAsMin(e.target.value)}
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
            const timeDecreased = routine.remainingSeconds < routine.originalDurationSeconds;
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
                    <p className="font-semibold ">{routine.name}</p>
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
                        onClick={() => deleteRoutine(routine?._id as string)}
                        disabled={!canEdit}
                        title={routine.isRunning ? "Stop timer before deleting" : undefined}
                      >
                        Delete
                      </Button>

                      {routine.isRunning ? (
                        <Button size="sm" variant="secondary" onClick={() => stopTimer(routine.id)}>
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
    </div>
  );
}