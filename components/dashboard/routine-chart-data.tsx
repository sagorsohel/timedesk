
'use client'
import { getUserRoutines } from "@/actions/routineAction";
import RoutinePieChart from "./RoutinePieChart";
import { use, useEffect, useState } from "react";


const dummyRoutines = [
    {
        _id: "68925a16e4e2a2fb59d8bd61",
        name: "Practice Code",
        originalDurationSeconds: 7200,
    },
    {
        _id: "68925a16e4e2a2fb59d8bd62",
        name: "Job Hunting",
        originalDurationSeconds: 3600,
    },
    {
        _id: "68925b90e59ad4ead3c9f928",
        name: "test",
        originalDurationSeconds: 300,
    },
    {
        _id: "6892757cb0b3214a9658b91f",
        name: "test",
        originalDurationSeconds: 4800,
    },
    {
        _id: "68925a16e4e2a2fb59d8bd65",
        name: "t1",
        originalDurationSeconds: 11400,
    },
];

export default function RoutineChartPage() {
    const [routineData, setRoutineData] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token") as string;
            if (token) {
                const result = await getUserRoutines(token);
                setRoutineData(result?.routines);
            }
        };

        fetchData(); // ✅ Call the async function inside useEffect
    }, []);

    console.log(routineData)
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Routine Duration Chart</h2>
            <RoutinePieChart routines={routineData} />
        </div>
    );
}
