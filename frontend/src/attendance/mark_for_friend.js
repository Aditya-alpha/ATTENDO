import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { LiaEditSolid } from "react-icons/lia"
import { MdDone } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"

export default function ShowTimeTable() {

    let [ttData, setTtData] = useState({
        branch: "",
        semester: "",
        schedule: [{
            time: "",
            subject: ""
        }]
    })
    let username = window.localStorage.getItem("username")
    let [friendName, setFriendName] = useState("")
    let [attendanceData, setAttendanceData] = useState({
        name: friendName,
        branch: ttData.branch,
        semester: ttData.semester,
        date: new Date().toISOString().slice(0, 10),
        attendance: [{
            time: "",
            subject: "",
            attended: false,
            marked_by_others: ""
        }]
    })
    let [markedFriends, setMarkedFriends] = useState([])
    let [subjectName, setSubjectName] = useState("")
    let [newTiming, setNewTiming] = useState("")
    let [isSubjectEditing, setIsSubjectEditing] = useState([])
    let [isTimeEditing, setIsTimeEditing] = useState([])
    let [searchFriend, setSearchFriend] = useState("")
    let [searchedUsers, setSearchedUsers] = useState([])

    useEffect(() => {
        async function handleFetchMarkedFriends() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/mark_for_friend`, {
                    method: "GET"
                })
                if (response.ok) {
                    let data = await response.json()
                    setMarkedFriends(data)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchMarkedFriends()
    }, [username])


    function handleIsAttended(i) {
        setAttendanceData(prev => {
            let newAttendance = [...prev.attendance]
            newAttendance[i] = { ...newAttendance[i], attended: !newAttendance[i].attended, marked_by_others: username }
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
        let filteredAttendanceData = { ...attendanceData, branch: ttData.branch, semester: ttData.semester, attendance: filteredAttendance }
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attendanceData: filteredAttendanceData, name: friendName, type: name === "reset" ? "reset" : "create" })
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
            semester: ttData.semester,
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

    async function handleFetchUsers(e) {
        setSearchFriend(e.target.value)
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_for_friend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendName: e.target.value.toLowerCase(), type: "search" })
            })
            if (response.ok) {
                let data = await response.json()
                setSearchedUsers(data)
                if (e.target.value.trim() === "") {
                    setSearchedUsers([])
                }
            }
            else if (response.status === 404) {
                alert("User not found !")
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    async function handleFetchAttendanceData(user, schedule) {
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: user.username, type: "show" })
            })
            let data = await response.json()
            if (data) {
                setAttendanceData(data)
            }
            else {
                setAttendanceData({
                    name: user.username,
                    branch: user.branch,
                    semester: user.semester,
                    date: new Date().toISOString().slice(0, 10),
                    attendance: schedule.map(sch => ({
                        time: sch.time,
                        subject: sch.subject,
                        attended: false,
                        marked_by_others: ""
                    }))
                })
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    async function handleFetchTTData(user) {
        try {
            const response = await fetch(`http://localhost:8000/${username}/mark_for_friend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendName: user.username, type: "fetchTT" })
            })
            if (response.ok) {
                let data = await response.json()
                setTtData(data)
                setIsSubjectEditing(() => data.schedule.map(() => false))
                setIsTimeEditing(() => data.schedule.map(() => false))
                handleFetchAttendanceData(user, data.schedule)
                setSearchedUsers([])
                setSearchFriend("")
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    function handleSelectFriend(user) {
        if (user.public === false) {
            alert("User profile is private. You cannot mark his/her attendance.")
            return
        }
        setFriendName(user.username)
        setTtData(prev => ({ ...prev, branch: user.branch }))
        handleFetchTTData(user)
    }

    return (
        <div className="h-full min-h-screen w-full bg-[#262523] text-white px-20 pb-12" >
            <Navbar />
            <div className="h-full flex gap-10" >
                <div className="w-4/5" >
                    {friendName ?
                        <>
                            <div className="w-full flex justify-between mt-6" >
                                <p className="text-3xl font-medium" >Time-Table</p>
                                <div className="flex gap-12 text-lg font-medium" >
                                    <button onClick={handleResetTT} className="bg-slate-700 rounded-lg px-8 py-2" >Reset Time Table</button>
                                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{ttData.semester}</p>
                                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{ttData.branch}</p>
                                </div>
                            </div>
                            <div className="my-12 flex flex-col gap-8" >
                                <div className="flex gap-28 text-xl font-medium" >
                                    <p className="w-1/3" >Timings</p>
                                    <p className="w-1/2" >Subjects</p>
                                    <p className="w-1/4" >Status</p>
                                </div>
                                {attendanceData.attendance.map((sch, i) => (
                                    <div key={i} className="flex gap-28 text-lg font-medium" >
                                        <div className="w-1/3 bg-slate-700 rounded-lg px-4 py-1" >
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
                                        <div className="w-1/2 bg-slate-700 rounded-lg px-4 py-1" >
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
                                        <p onClick={() => handleIsAttended(i)} className="w-1/4 bg-slate-700 rounded-lg px-4 py-1 flex justify-between cursor-pointer" >Attended: {attendanceData.attendance[i]?.attended ? <MdCheckBox className="text-2xl mt-[3px]" /> : <MdCheckBoxOutlineBlank className="text-2xl mt-[3px]" />}</p>
                                    </div>
                                ))}
                                <div className="flex self-center mt-2 font-medium text-lg gap-10 ml-16" >
                                    <button onClick={handleAddExtra} className="w-36 bg-slate-700 p-2 rounded-lg flex gap-2" ><IoMdAdd className="text-3xl" />Add Extra</button>
                                    <button onClick={() => handleSaveChanges(attendanceData)} className="w-36 bg-slate-700 p-2 rounded-lg" >Save Changes</button>
                                </div>
                            </div>
                        </>
                        :
                        <div className="flex flex-col items-center mt-40 text-gray-400">
                            <p className="mb-4 text-lg">Waiting for friend selection...</p>
                            <div className="animate-pulse space-y-4 w-full px-8">
                                <div className="h-6 bg-gray-700 rounded w-1/3 mx-auto"></div>
                                <div className="h-6 bg-gray-700 rounded w-2/3 mx-auto"></div>
                                <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    }
                </div>
                <div className="w-1/5 h-full bg-slate-700 rounded-lg px-4 py-6 mt-6 font-medium" >
                    <input value={searchFriend} autoFocus placeholder="Search friends" onChange={(e) => handleFetchUsers(e)} className="w-full rounded-md px-2 py-1 text-black outline-none" />
                    <div className="mt-4 flex flex-col gap-4 text-lg bg-slate-500 px-2 rounded-md" >
                        {searchedUsers.map((user, i) =>
                            user.username !== username &&
                            <div key={i} className="flex justify-between" >
                                <p>{user.username}</p>
                                <p onClick={() => handleSelectFriend(user)} className="text-xs rounded-md bg-slate-700 flex items-center px-2 my-1 cursor-pointer" >Mark</p>
                            </div>
                        )}
                    </div>
                    {friendName !== "" &&
                        <div className="w-full mt-4 flex gap-2 bg-slate-500 rounded-lg px-2 py-1" >
                            <p>Marking for:</p>
                            <p>{friendName}</p>
                        </div>
                    }
                    {markedFriends.length > 0 &&
                        <p className="mt-6" >My Friends</p>
                    }
                    <div className="mt-3 flex flex-col gap-4 text-lg bg-slate-500 px-2 rounded-md" >
                        {markedFriends.length > 0 && markedFriends.map((friend, i) =>
                            <div key={i} className="flex justify-between" >
                                <p>{friend.username}</p>
                                <p onClick={() => handleSelectFriend(friend)} className="text-xs rounded-md bg-slate-700 flex items-center px-2 my-1 cursor-pointer" >Mark</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}