import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"

export default function ShowTimeTable() {

    let [ttData, setTtData] = useState({
        branch: "Mechanical",
        schedule: [{
            time: "",
            subject: ""
        }]
    })
    let username = window.localStorage.getItem("username")
    let [attendanceData, setAttendanceData] = useState({
        name: username,
        branch: ttData.branch,
        date: new Date().toISOString().slice(0, 10),
        attendance: [{
            time: "",
            subject: "",
            attended: false
        }],
        marked_by_others: ""
    })

    useEffect(() => {
        async function handleFetchTTData() {
            try {
                const response = await fetch("http://localhost:8000/view_time-table", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ branch: ttData.branch })
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

    useEffect(() => {
        async function handleFetchAttendanceData() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ type: "show" })
                })
                let data = await response.json()
                if (data) {
                    setAttendanceData(data)
                }
                else {
                    setAttendanceData(prev => ({
                        ...prev, branch: ttData.branch, attendance: ttData.schedule.map(sch => ({
                            time: sch.time,
                            subject: sch.subject,
                            attended: false
                        }))
                    }))
                }
            }
            catch (error) {
                console.log(error)
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchAttendanceData()
    }, [ttData.schedule, ttData.branch, attendanceData.name])

    function handleIsAttended(i) {
        setAttendanceData(prev => {
            let newAttendance = [...prev.attendance]
            newAttendance[i] = { ...newAttendance[i], attended: !newAttendance[i].attended }
            return { ...prev, attendance: newAttendance }
        })
    }

    async function handleSaveChanges(e) {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attendanceData, type: "create" })
            })
            if (response.ok) {
                let data = await response.json()
                alert(`${data.message}`)
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

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
                    <p className="w-1/5" >Status</p>
                </div>
                {ttData.schedule.map((sch, i) => (
                    <div key={i} className="flex gap-20" >
                        <p className="w-1/6 bg-slate-700 rounded-lg px-4 py-1 text-lg font-medium" >{sch.time}</p>
                        <p className="w-2/5 bg-slate-700 rounded-lg px-4 py-1 text-lg font-medium" >{sch.subject}</p>
                        <p onClick={() => handleIsAttended(i)} className="w-1/5 bg-slate-700 rounded-lg px-4 py-1 text-lg font-medium flex justify-between cursor-pointer" >Attended: {attendanceData.attendance[i]?.attended ? <MdCheckBox className="text-2xl mt-[3px]" /> : <MdCheckBoxOutlineBlank className="text-2xl mt-[3px]" />}</p>
                    </div>
                ))}
                <button onClick={(e) => handleSaveChanges(e)} className="w-36 bg-slate-700 p-2 rounded-lg self-center mt-2 font-medium text-lg" >Save Changes</button>
            </div>
        </div>
    )
}