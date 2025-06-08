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
        semester: "",
        schedule: [{
            time: "",
            subject: ""
        }]
    })
    let username = window.localStorage.getItem("username")
    let [targetDate, setTargetDate] = useState(new Date().toISOString().slice(0, 10))
    let [attendanceData, setAttendanceData] = useState({
        name: username,
        branch: ttData.branch,
        semester: ttData.semester,
        date: targetDate,
        attendance: [{
            time: "",
            subject: "",
            attended: null,
            marked_by_others: ""
        }]
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

    async function handleFetchAttendanceData() {
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: username, date: targetDate, type: "show" })
            })
            if (response.ok) {
                let data = await response.json()
                if (data) {
                    setAttendanceData(data)
                }
            }
            else {
                if (targetDate !== new Date().toISOString().slice(0, 10)) {
                    alert ("No record found but you can mark the attendance.")
                }
                setAttendanceData({
                    branch: ttData.branch,
                    semester: ttData.semester,
                    date: targetDate,
                    attendance: ttData.schedule.map(sch => ({
                        time: sch.time,
                        subject: sch.subject,
                        attended: null,
                        marked_by_others: ""
                    }))
                })
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    useEffect(() => {
        if (ttData.schedule.length > 0) {
            handleFetchAttendanceData()
        }
    }, [username, ttData.schedule.length, ttData.branch, ttData.semester, targetDate])

    function handleIsAttended(i, value) {
        setAttendanceData(prev => {
            let newAttendance = [...prev.attendance]
            newAttendance[i] = { ...newAttendance[i], attended: value }
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
                body: JSON.stringify({ attendanceData: filteredAttendanceData, name: username, date: targetDate, type: name === "reset" ? "reset" : "create" })
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
            attended: null,
            marked_by_others: ""
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
            attended: null
        }
        setAttendanceData(prev => {
            const updatedAttendance = [...prev.attendance, newEntry]
            return { ...prev, attendance: updatedAttendance }
        })
        setIsSubjectEditing(prev => [...prev, true])
        setIsTimeEditing(prev => [...prev, true])
    }

    return (
        <div className="h-full min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between items-center my-8" >
                <p className="text-3xl font-medium" >Time-Table</p>
                <div className="flex gap-6 items-center font-bold" >
                    <button onClick={handleResetTT} className="bg-red-600 hover:bg-red-700 transition rounded-md px-6 py-2" >Reset Time Table</button>
                    <button onClick={() => navigate(`/${username}/mark_for_friend`)} className="bg-blue-600 hover:bg-blue-700 transition rounded-md px-6 py-2" >Mark for friends</button>
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-md px-8 py-2" >{ttData.semester}</p>
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-md px-6 py-2" >{ttData.branch}</p>
                    <input id="date-input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} onClick={() => document.getElementById("date-input").showPicker()} onFocus={(e) => e.target.blur()} className="bg-blue-600 hover:bg-blue-700 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 outline-none cursor-pointer" />
                </div>
            </div>
            <div className="my-12 flex flex-col gap-8" >
                <div className="flex gap-20 text-xl font-medium" >
                    <p className="w-1/5" >Timings</p>
                    <p className="w-2/5" >Subjects</p>
                    <p className="w-2/5" >Status</p>
                </div>
                {attendanceData.attendance.map((sch, i) => (
                    <div key={i} className="flex gap-20 text-lg font-medium" >
                        <div className={`w-1/5 bg-gray-800 ${!isTimeEditing[i] && "hover:bg-gray-800/50"} rounded-lg px-4 py-2 border-[1px] border-gray-500`} >
                            {isTimeEditing[i] ?
                                <div className="flex justify-between" >
                                    <input value={newTiming} onChange={(e) => setNewTiming(e.target.value)} autoFocus className="w-full bg-gray-800 outline-none pr-6" />
                                    <MdDone onClick={() => { handleEditing("time", i); handleSaveTimeEdit(i) }} className="text-2xl mt-1 cursor-pointer" />
                                </div>
                                :
                                <div className="flex justify-between" >
                                    <p>{sch.time}</p>
                                    <LiaEditSolid onClick={() => handleEditing("time", i)} className="text-xl mt-1 cursor-pointer" />
                                </div>
                            }
                        </div>
                        <div className={`w-2/5 bg-gray-800 ${!isSubjectEditing[i] && "hover:bg-gray-800/50"} rounded-lg px-4 py-2 border-[1px] border-gray-500`} >
                            {isSubjectEditing[i] ?
                                <div className="flex justify-between" >
                                    <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} autoFocus placeholder="Enter subject name" className="w-full bg-gray-800 outline-none pr-6" />
                                    <MdDone onClick={() => { handleEditing("subject", i); handleSaveSubjectEdit(i) }} className="text-2xl mt-1 cursor-pointer" />
                                </div>
                                :
                                <div className="flex justify-between" >
                                    <p>{sch.subject}</p>
                                    <LiaEditSolid onClick={() => handleEditing("subject", i)} className="text-xl mt-1 cursor-pointer" />
                                </div>
                            }
                        </div>
                        <div className="w-2/5 bg-gray-800 hover:bg-gray-800/50 rounded-lg px-8 py-2 flex gap-6 border-[1px] border-gray-500">
                            <div
                                onClick={() => handleIsAttended(i, true)}
                                className={`flex items-center gap-2 cursor-pointer ${sch.attended === true ? "text-green-400" : "text-white"}`} >
                                {sch.attended === true ? <MdCheckBox className="text-2xl" /> : <MdCheckBoxOutlineBlank className="text-2xl" />}
                                <p>Attended</p>
                            </div>
                            <div
                                onClick={() => handleIsAttended(i, false)}
                                className={`flex items-center gap-2 cursor-pointer ${sch.attended === false ? "text-red-400" : "text-white"}`} >
                                {sch.attended === false ? <MdCheckBox className="text-2xl" /> : <MdCheckBoxOutlineBlank className="text-2xl" />}
                                <p>Not Attended</p>
                            </div>
                            <div
                                onClick={() => handleIsAttended(i, null)}
                                className={`flex items-center gap-2 cursor-pointer ${sch.attended === null ? "text-yellow-400" : "text-white"}`} >
                                {sch.attended === null ? <MdCheckBox className="text-2xl" /> : <MdCheckBoxOutlineBlank className="text-2xl" />}
                                <p>Cancelled</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex self-center mt-2 font-semibold text-lg gap-16" >
                    <button onClick={handleAddExtra} className="w-36 bg-blue-600 hover:bg-blue-700 transition p-2 rounded-lg flex gap-2" ><IoMdAdd className="text-3xl" />Add Extra</button>
                    <button onClick={() => handleSaveChanges(attendanceData)} className="w-36 bg-green-600 hover:bg-green-700 transition p-2 rounded-lg" >Save Changes</button>
                </div>
            </div>
        </div>
    )
}