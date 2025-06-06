import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { CgCheckO, CgCloseO } from "react-icons/cg"
import { useNavigate } from "react-router-dom"

export default function ShowRecords() {

    let navigate = useNavigate()
    let username = window.localStorage.getItem("username")
    let [targetDate, setTargetDate] = useState("")
    let [attendanceData, setAttendanceData] = useState({
        name: "",
        branch: "",
        semester: "",
        date: "",
        attendance: [],
        marked_by_others: ""
    })

    useEffect(() => {
        async function handleFetchLastDate() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/attendance_records`, {
                    method: "GET"
                })
                if (response.status === 200) {
                    let data = await response.json()
                    if (data) {
                        setTargetDate(data.date.slice(0, 10))
                        setAttendanceData(data)
                    }
                }
                else if (response.status === 400) {
                    alert("No attendance record found. First mark attendance then records will be available.")
                    navigate(`/${username}/mark_attendance`)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchLastDate()
    }, [username, navigate])

    async function handleFetchAttendanceData(e) {
        let value = e.target.value
        setTargetDate(value)
        try {
            const response = await fetch(`http://localhost:8000/${username}/attendance_records`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ targetDate: value })
            })
            if (response.status === 200) {
                let data = await response.json()
                setAttendanceData(data)
            }
            else if (response.status === 408) {
                alert("No attendance record found for this date.")
                if (attendanceData?.date) {
                    setTargetDate(attendanceData.date.slice(0, 10))
                } else {
                    setTargetDate("")
                }

            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    return (
        <div className="h-full min-h-screen w-full bg-[#262523] text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-medium" >Attendance Records</p>
                <div className="flex gap-12 text-lg font-medium" >
                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{attendanceData?.semester}</p>
                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{attendanceData?.branch}</p>
                    <input type="date" value={targetDate} onChange={(e) => handleFetchAttendanceData(e)} className="bg-slate-700 rounded-lg px-4 py-2" />
                </div>
            </div>
            <div className="my-12 flex flex-col gap-8" >
                <div className="flex gap-20 text-xl font-medium" >
                    <p className="w-1/6" >Timings</p>
                    <p className="w-2/5" >Subjects</p>
                    <p className="w-1/5" >Status</p>
                </div>
                {attendanceData.attendance.length > 0 && attendanceData.attendance.map((record, i) => (
                    <div key={i} className="flex gap-20 text-lg font-medium" >
                        <p className="w-1/6 bg-slate-700 rounded-lg px-4 py-1" >{record.time}</p>
                        <p className="w-2/5 bg-slate-700 rounded-lg px-4 py-1" >{record.subject}</p>
                        <div className="w-1/5 relative group" >
                            {record.marked_by_others !== "" &&
                                <p className="absolute bottom-12 -right-12 bg-black text-white text-sm px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap" >Marked by: &nbsp; {record.marked_by_others}</p>
                            }
                            <p className="w-full bg-slate-700 rounded-lg px-4 py-1 flex justify-between" >{attendanceData.attendance[i]?.attended ? <> Attended <CgCheckO className="text-2xl mt-1" /> </> : <>Not Attended <CgCloseO className="text-2xl mt-1" /> </>}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}