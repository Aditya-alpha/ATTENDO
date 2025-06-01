import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { CgCheckO, CgCloseO } from "react-icons/cg";

export default function ShowRecords() {

    let username = window.localStorage.getItem("username")
    let [targetDate, setTargetDate] = useState(new Date().toISOString().slice(0, 10))
    let [attendanceData, setAttendanceData] = useState({
        name: "",
        branch: "",
        date: "",
        attendance: [],
        marked_by_others: ""
    })

    useEffect(() => {
        async function handleFetchAttendanceData() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/attendance_records`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ targetDate })
                })
                if (response.status === 200) {
                    let data = await response.json()
                    setAttendanceData(data)
                }
                if (response.status === 408) {
                    alert("No attendance record found for this date.")
                    setTargetDate(attendanceData.date)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchAttendanceData()
    }, [targetDate])

    return (
        <div className="h-full w-full bg-[#262523] text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-medium" >Attendance Records</p>
                <div className="flex gap-12 text-lg font-medium" >
                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{attendanceData?.branch}</p>
                    <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-slate-700 rounded-lg px-4 py-2" />
                </div>
            </div>
            <div className="my-12 flex flex-col gap-8" >
                <div className="flex gap-20 text-xl font-medium" >
                    <p className="w-1/6" >Timings</p>
                    <p className="w-2/5" >Subjects</p>
                    <p className="w-1/5" >Status</p>
                </div>
                {attendanceData.attendance.map((record, i) => (
                    <div key={i} className="flex gap-20 text-lg font-medium" >
                        <p className="w-1/6 bg-slate-700 rounded-lg px-4 py-1" >{record.time}</p>
                        <p className="w-2/5 bg-slate-700 rounded-lg px-4 py-1" >{record.subject}</p>
                        <p className="w-1/5 bg-slate-700 rounded-lg px-4 py-1 flex justify-between" >{attendanceData.attendance[i]?.attended ? <> Attended <CgCheckO className="text-2xl mt-1" /> </>: <>Not Attended <CgCloseO className="text-2xl mt-1" /> </>}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}