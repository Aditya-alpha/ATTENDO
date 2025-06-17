import { useContext, useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { CgCheckO, CgCloseO } from "react-icons/cg"
import { useNavigate } from "react-router-dom"
import { Context } from "../App"

export default function ShowRecords() {

    let navigate = useNavigate()
    let {username} = useContext(Context)
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
                const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/attendance_records`, {
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
            const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/attendance_records`, {
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
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    return (
        <div className="h-full min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-medium" >Attendance Records</p>
                <div className="flex gap-8 font-bold" >
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-md px-8 py-2" >{daysOfWeek[new Date(attendanceData?.date).getDay()]}</p>
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-lg px-8 py-2" >{attendanceData?.semester}</p>
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-lg px-6 py-2" >{attendanceData?.branch}</p>
                    <input id="date-input" type="date" value={targetDate} onChange={(e) => handleFetchAttendanceData(e)} onClick={() => document.getElementById("date-input").showPicker()} onFocus={(e) => e.target.blur()} className="bg-blue-900 hover:bg-blue-900/50 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 outline-none cursor-pointer" />
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
                        <p className="w-1/6 bg-gray-800 hover:bg-gray-800/50 transition border-[1px] border-gray-500 rounded-lg px-4 py-2" >{record.time}</p>
                        <p className="w-2/5 bg-gray-800 hover:bg-gray-800/50 transition border-[1px] border-gray-500 rounded-lg px-4 py-2" >{record.subject}</p>
                        <div className="w-1/5 relative group" >
                            {record.marked_by_others !== "" &&
                                <p className="absolute bottom-12 -right-12 bg-black text-white text-sm px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap" >Marked by: &nbsp; {record.marked_by_others}</p>
                            }
                            <p className="w-full bg-gray-800 hover:bg-gray-800/50 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 flex justify-between" >
                                {attendanceData.attendance[i]?.attended === true &&
                                    <> Attended <CgCheckO className="text-2xl mt-1" /> </>
                                }
                                {attendanceData.attendance[i]?.attended === false &&
                                    <>Not Attended <CgCloseO className="text-2xl mt-1" /> </>
                                }
                                {attendanceData.attendance[i]?.attended === null &&
                                    <>Cancelled</>
                                }
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}