import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { LiaEditSolid } from "react-icons/lia"
import { MdDone } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"

export default function ShowTimeTable() {

    let navigate = useNavigate()
    let [ttData, setTtData] = useState({
        branch: "",
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
    let [subjectName, setSubjectName] = useState("")
    let [newTiming, setNewTiming] = useState("")
    let [isSubjectEditing, setIsSubjectEditing] = useState([])
    let [isTimeEditing, setIsTimeEditing] = useState([])

    useEffect(() => {
        async function handleFetchTTData() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                    method: "GET"
                })
                if (response.ok) {
                    let data = await response.json()
                    setTtData(data)
                    setIsSubjectEditing(() => data.schedule.map(() => false))
                    setIsTimeEditing(() => data.schedule.map(() => false))
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchTTData()
    }, [username])

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
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchAttendanceData()
    }, [username, ttData.schedule, ttData.branch, attendanceData.name])

    function handleIsAttended(i) {
        setAttendanceData(prev => {
            let newAttendance = [...prev.attendance]
            newAttendance[i] = { ...newAttendance[i], attended: !newAttendance[i].attended }
            return { ...prev, attendance: newAttendance }
        })
    }

    function handleEditing(name, i) {
        if (name === "subject") {
            setSubjectName(attendanceData.attendance[i].subject)
            setIsSubjectEditing(prev => {
                let arr = [...prev]
                arr[i] = !arr[i]
                return arr
            })
        }
        else if (name === "time") {
            setNewTiming(attendanceData.attendance[i].time)
            setIsTimeEditing(prev => {
                let arr = [...prev]
                arr[i] = !arr[i]
                return arr
            })
        }
    }

    async function handleSaveChanges(attendanceData, name) {
        if ((name !== "subject" && name !== "time") && (isSubjectEditing.some(val => val) || isTimeEditing.some(val => val))) {
            alert("First save the changes made.")
            return
        }
        let filteredAttendance = attendanceData.attendance.filter(rec => rec.subject.trim() !== "" && rec.time.trim() !== "")
        let filteredAttendanceData = { ...attendanceData, attendance: filteredAttendance }
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attendanceData: filteredAttendanceData, type: "create" })
            })
            if (response.ok) {
                let data = await response.json()
                if (name !== "reset")
                    alert(`${data.message}`)
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    function handleSaveSubjectEdit(i) {
        setAttendanceData(prev => {
            let arr = [...prev.attendance]
            if (arr[i].subject !== subjectName.trim()) {
                arr[i] = { ...arr[i], subject: subjectName }
                let updatedAttendanceData = { ...prev, attendance: arr }
                handleSaveChanges(updatedAttendanceData, "subject")
                return updatedAttendanceData
            }
            return prev
        })
    }

    function handleSaveTimeEdit(i) {
        setAttendanceData(prev => {
            let arr = [...prev.attendance]
            if (arr[i].time !== newTiming.trim()) {
                arr[i] = { ...arr[i], time: newTiming }
                let updatedData = { ...prev, attendance: arr }
                handleSaveChanges(updatedData, "time")
                return updatedData
            }
            return prev
        })
    }

    function handleResetTT() {
        let confirmReset = window.confirm("Are you sure you want to reset the timetable to default? If yes, you will lose today's record.");
        if (!confirmReset) return
        let updatedAttendance = ttData.schedule.map(sch => ({
            time: sch.time,
            subject: sch.subject,
            attended: false
        }))

        let newAttendanceData = {
            ...attendanceData,
            branch: ttData.branch,
            attendance: updatedAttendance
        }

        setAttendanceData(newAttendanceData)
        handleSaveChanges(newAttendanceData, "reset")
    }

    function handleAddExtra() {
        const newEntry = {
            time: "",
            subject: "",
            attended: false
        }
        setAttendanceData(prev => {
            const updatedAttendance = [...prev.attendance, newEntry]
            return { ...prev, attendance: updatedAttendance }
        })
        setIsSubjectEditing(prev => [...prev, true])
        setIsTimeEditing(prev => [...prev, true])
    }

    return (
        <div className="h-full min-h-screen w-full bg-[#262523] text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-medium" >Time-Table</p>
                <div className="flex gap-12 text-lg font-medium" >
                    <button onClick={handleResetTT} className="bg-slate-700 rounded-lg px-8 py-2" >Reset Time Table</button>
                    <button onClick={() => navigate(`/${username}/mark_for_friend`)} className="bg-slate-700 rounded-lg px-8 py-2" >Mark for friend</button>
                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{ttData.branch}</p>
                </div>
            </div>
            <div className="my-12 flex flex-col gap-8" >
                <div className="flex gap-20 text-xl font-medium" >
                    <p className="w-1/5" >Timings</p>
                    <p className="w-2/5" >Subjects</p>
                    <p className="w-1/5" >Status</p>
                </div>
                {attendanceData.attendance.map((sch, i) => (
                    <div key={i} className="flex gap-20 text-lg font-medium" >
                        <div className="w-1/5 bg-slate-700 rounded-lg px-4 py-1" >
                            {isTimeEditing[i] ?
                                <div className="flex justify-between" >
                                    <input value={newTiming} onChange={(e) => setNewTiming(e.target.value)} autoFocus className="w-full bg-slate-700 outline-none pr-6" />
                                    <MdDone onClick={() => { handleEditing("time", i); handleSaveTimeEdit(i) }} className="text-2xl mt-1 cursor-pointer" />
                                </div>
                                :
                                <div className="flex justify-between" >
                                    <p>{sch.time}</p>
                                    <LiaEditSolid onClick={() => handleEditing("time", i)} className="text-xl mt-1 cursor-pointer" />
                                </div>
                            }
                        </div>
                        <div className="w-2/5 bg-slate-700 rounded-lg px-4 py-1" >
                            {isSubjectEditing[i] ?
                                <div className="flex justify-between" >
                                    <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} autoFocus placeholder="Enter subject name" className="w-full bg-slate-700 outline-none pr-6" />
                                    <MdDone onClick={() => { handleEditing("subject", i); handleSaveSubjectEdit(i) }} className="text-2xl mt-1 cursor-pointer" />
                                </div>
                                :
                                <div className="flex justify-between" >
                                    <p>{sch.subject}</p>
                                    <LiaEditSolid onClick={() => handleEditing("subject", i)} className="text-xl mt-1 cursor-pointer" />
                                </div>
                            }
                        </div>
                        <p onClick={() => handleIsAttended(i)} className="w-1/5 bg-slate-700 rounded-lg px-4 py-1 flex justify-between cursor-pointer" >Attended: {attendanceData.attendance[i]?.attended ? <MdCheckBox className="text-2xl mt-[3px]" /> : <MdCheckBoxOutlineBlank className="text-2xl mt-[3px]" />}</p>
                    </div>
                ))}
                <div className="flex self-center mt-2 font-medium text-lg gap-16" >
                    <button onClick={handleAddExtra} className="w-36 bg-slate-700 p-2 rounded-lg flex gap-2" ><IoMdAdd className="text-3xl" />Add Extra</button>
                    <button onClick={() => handleSaveChanges(attendanceData)} className="w-36 bg-slate-700 p-2 rounded-lg" >Save Changes</button>
                </div>
            </div>
        </div>
    )
}