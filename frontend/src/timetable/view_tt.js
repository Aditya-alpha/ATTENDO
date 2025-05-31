import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"

export default function ShowTimeTable() {

    let [ttData, setTtData] = useState({
        branch: "Mechanical",
        schedule: [{
            time: "",
            subject: ""
        }]
    })

    useEffect(() => {
        async function handleFetchTTData() {
            try {
                const response = await fetch("http://localhost:8000/view_time-table", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        branch: ttData.branch
                    })
                })
                if (response.ok) {
                    let data = await response.json()
                    setTtData(data)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchTTData()
    }, [ttData.branch])

    return (
        <div className="h-full w-full bg-[#262523] text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-medium" >Time-Table</p>
                <select value={ttData.branch} onChange={(e) => setTtData(prev => ({ ...prev, branch: e.target.value }))} className="bg-slate-700 rounded-lg px-4 py-2 text-lg font-medium" >
                    <option value="Mechanical" >Mechanical</option>
                    <option value="Civil" >Civil</option>
                    <option value="Textile" >Textile</option>
                    <option value="Computer Science" >Computer Science</option>
                    <option value="Electronics" >Electronics</option>
                    <option value="ExTC" >ExTC</option>
                    <option value="IT" >IT</option>
                    <option value="Electrical" >Electrical</option>
                    <option value="Production" >Production</option>
                </select>
            </div>
            <div className="my-12 flex flex-col gap-8" >
                <div className="flex gap-20 text-xl font-medium" >
                    <p className="w-1/6" >Timings</p>
                    <p className="w-2/5" >Subjects</p>
                </div>
                {ttData.schedule.map((sch, i) => (
                    <div key={i} className="flex gap-20" >
                        <p className="w-1/6 bg-slate-700 rounded-lg px-4 py-1 text-lg font-medium" >{sch.time}</p>
                        <p className="w-2/5 bg-slate-700 rounded-lg px-4 py-1 text-lg font-medium" >{sch.subject}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}