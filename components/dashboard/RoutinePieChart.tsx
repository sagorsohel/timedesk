"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface Routine {
    _id: string;
    name: string;
    originalDurationSeconds: number;
    remainingSeconds: number;
}

interface Props {
    routines: Routine[];
}

// Helper to convert seconds to "1h 30m"
function formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h ? `${h}h ` : ""}${m}m`;
}

export default function RoutineBarChart({ routines }: Props) {
    const data = routines?.map((routine) => ({
        name: routine?.name,
        completed: Math.max(
            routine?.originalDurationSeconds - routine?.remainingSeconds,
            0
        ),
        remaining: routine?.remainingSeconds,
    }));

    return (
        <div className="w-full h-[420px] rounded-2xl shadow-lg p-6 bg-white dark:bg-zinc-900">
            <h2 className="text-xl font-semibold mb-4 text-center text-zinc-800 dark:text-zinc-100">
                Routine Progress Overview
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart style={{ paddingBottom: '10px' }} data={data} barCategoryGap="20%" margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `${Math.floor(val / 60)}m`} />
                    <Tooltip
                        contentStyle={{ borderRadius: 8 }}
                        formatter={(value: number, name: string) => [formatSeconds(value), name === 'completed' ? 'Completed' : 'Remaining']}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Bar dataKey="completed" stackId="a" radius={[8, 8, 0, 0]} name="Completed" fill="#88d9a5" />
                    <Bar dataKey="remaining" stackId="a" radius={[8, 8, 0, 0]} name="Remaining" fill="#f39292" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
