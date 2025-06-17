import { useContext, useEffect, useState } from "react"
import Navbar from "../navbar/navbar"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { LiaEditSolid } from "react-icons/lia"
import { MdDone } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"
import { Context } from "../App"

export default function ShowTimeTable() {

    let [ttData, setTtData] = useState({
        branch: "",
        semester: "",
        schedule: [{
            time: "",
            subject: ""
        }]
    })
    let {username} = useContext(Context)
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
                const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/mark_for_friend`, {
                    method: "GET"
                })
                if (response.ok) {
                    let data = await response.json()
                    let uniqueData = [...new Map(data.map(item => [item.username, item])).values()]
                    setMarkedFriends(uniqueData)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchMarkedFriends()
    }, [username])


    function handleIsAttended(i, value) {
        setAttendanceData(prev => {
            let newAttendance = [...prev.attendance]
            newAttendance[i] = { ...newAttendance[i], attended: value, marked_by_others: username }
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
            const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attendanceData: filteredAttendanceData, name: friendName, date: attendanceData.date, type: name === "reset" ? "reset" : "create" })
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
            attended: null
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
            const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/mark_for_friend`, {
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

    async function handleFetchAttendanceData(user, schedule, date) {
        try {
            const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/mark_attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: user.username, date, type: "show" })
            })
            let data = await response.json()
            if (data.attendance?.length > 0) {
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

    async function handleFetchTTData(user) {
        try {
            const response = await fetch(`https://attendo-h4oc.onrender.com/${username}/mark_for_friend`, {
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
                handleFetchAttendanceData(user, data.schedule, attendanceData.date)
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
        <div className="h-full min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="h-full flex gap-10" >
                <div className="w-4/5" >
                    {friendName ?
                        <>
                            <div className="w-full flex justify-between mt-6" >
                                <p className="text-3xl font-medium" >Time-Table</p>
                                <div className="flex gap-12 items-center font-bold" >
                                    <button onClick={handleResetTT} className="bg-red-600 hover:bg-red-700 transition rounded-md px-6 py-2" >Reset Time Table</button>
                                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-md px-8 py-2" >{ttData.day}</p>
                                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-md px-8 py-2" >{ttData.semester}</p>
                                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-md px-6 py-2" >{ttData.branch}</p>
                                </div>
                            </div>
                            <div className="my-12 flex flex-col gap-8" >
                                <div className="flex gap-6 text-xl font-medium" >
                                    <p className="w-1/5" >Timings</p>
                                    <p className="w-1/3" >Subjects</p>
                                    <p className="w-2/5" >Status</p>
                                </div>
                                {attendanceData.attendance.map((sch, i) => (
                                    <div key={i} className="flex gap-6 text-md font-medium" >
                                        <div className={`w-1/5 bg-gray-800 ${!isTimeEditing[i] && "hover:bg-gray-800/50"} rounded-lg px-4 py-2 border-[1px] border-gray-500`} >
                                            {isTimeEditing[i] ?
                                                <div className="flex justify-between" >
                                                    <select value={newTiming} onChange={(e) => setNewTiming(e.target.value)} className="w-full bg-gray-800 outline-none mr-2" >
                                                        {ttData.schedule.map((sch, i) =>
                                                            <option key={i} value={sch.time} >{sch.time}</option>
                                                        )}
                                                    </select>
                                                    <MdDone onClick={() => { handleEditing("time", i); handleSaveTimeEdit(i) }} className="text-2xl mt-1 cursor-pointer" />
                                                </div>
                                                :
                                                <div className="flex justify-between" >
                                                    <p>{sch.time}</p>
                                                    <LiaEditSolid onClick={() => handleEditing("time", i)} className="text-xl mt-1 cursor-pointer" />
                                                </div>
                                            }
                                        </div>
                                        <div className={`w-1/3 bg-gray-800 ${!isSubjectEditing[i] && "hover:bg-gray-800/50"} rounded-lg px-4 py-2 border-[1px] border-gray-500`} >
                                            {isSubjectEditing[i] ?
                                                <div className="flex justify-between" >
                                                    <select value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full bg-gray-800 outline-none mr-12" >
                                                        {ttData.schedule.map((sch, i) =>
                                                            <option key={i} value={sch.subject} >{sch.subject}</option>
                                                        )}
                                                    </select>
                                                    <MdDone onClick={() => { handleEditing("subject", i); handleSaveSubjectEdit(i) }} className="text-2xl mt-1 cursor-pointer" />
                                                </div>
                                                :
                                                <div className="flex justify-between" >
                                                    <p>{sch.subject}</p>
                                                    <LiaEditSolid onClick={() => handleEditing("subject", i)} className="text-xl mt-1 cursor-pointer" />
                                                </div>
                                            }
                                        </div>
                                        <div className="w-2/5 bg-gray-800 hover:bg-gray-800/50 rounded-lg px-4 py-2 flex justify-between gap-6 border-[1px] border-gray-500">
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
                                <div className="flex self-center mt-2 font-medium text-lg gap-10 ml-16" >
                                    <button onClick={handleAddExtra} className="w-36 bg-blue-600 hover:bg-blue-700 transition p-2 rounded-lg flex gap-2" ><IoMdAdd className="text-3xl" />Add Extra</button>
                                    <button onClick={() => handleSaveChanges(attendanceData)} className="w-36 bg-green-600 hover:bg-green-700 transition p-2 rounded-lg" >Save Changes</button>
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
                <div className="w-1/5 h-full bg-gray-800 rounded-lg px-4 py-6 mt-6 font-medium border-[1px] border-gray-500" >
                    <input value={searchFriend} autoFocus placeholder="Search friends" onChange={(e) => handleFetchUsers(e)} className="w-full rounded-md px-2 py-1 text-black outline-none" />
                    <div className="mt-4 flex flex-col gap-4 text-lg bg-gray-700 px-2 rounded-md border-[1px] border-gray-500" >
                        {searchedUsers.map((user, i) =>
                            user.username !== username &&
                            <div key={i} className="flex justify-between" >
                                <p>{user.username}</p>
                                <p onClick={() => handleSelectFriend(user)} className="text-xs rounded-md bg-gray-800 flex items-center px-2 my-1 cursor-pointer" >Mark</p>
                            </div>
                        )}
                    </div>
                    {friendName !== "" &&
                        <div className="w-full mt-4 flex gap-2 bg-gray-700 rounded-lg px-2 py-1 border-[1px] border-gray-500" >
                            <p>Marking for:</p>
                            <p>{friendName}</p>
                        </div>
                    }
                    {markedFriends.length > 0 &&
                        <p className="mt-6" >My Friends</p>
                    }
                    <div className="mt-3 flex flex-col gap-4 text-lg bg-gray-700 px-2 rounded-md border-[1px] border-gray-500" >
                        {markedFriends.length > 0 && markedFriends.map((friend, i) =>
                            <div key={i} className="flex justify-between" >
                                <p>{friend.username}</p>
                                <p onClick={() => handleSelectFriend(friend)} className="text-xs rounded-md bg-gray-800 flex items-center px-2 my-1 cursor-pointer" >Mark</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}