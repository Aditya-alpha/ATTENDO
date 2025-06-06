import { useParams } from "react-router-dom"
import Navbar from "../navbar/navbar"
import { useEffect, useState } from "react"
import Heatmap from "../visualizations/heatmap"
import CircularProgress from "../visualizations/percentageImage"

export default function ShowAnalysis() {

    let { username } = useParams()
    let [attendanceData, setAttendanceData] = useState([{
        username: username,
        branch: "",
        semester: "",
        date: new Date().toISOString().slice(0, 10),
        attendance: [{
            time: "",
            subject: "",
            attended: false,
            marked_by_others: ""
        }]
    }])

    let [analysedData, setAnalysedData] = useState([{
        subject: "",
        totalClasses: "",
        attended: "",
        percentage: "",
        lastAttended: ""
    }])

    let [selectedSubject, setSelectedSubject] = useState("")
    let [activityData, setActivityData] = useState([])
    let [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {
        async function handleFetch() {
            try {
                let response = await fetch(`http://localhost:8000/${username}/attendance_analysis`, {
                    method: "GET"
                })
                if (response.ok) {
                    let data = await response.json()
                    setAttendanceData(data)
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetch()
    }, [username])

    useEffect(() => {
        if (attendanceData.length > 0 && attendanceData[0].attendance.length > 0) {
            setSelectedSubject(attendanceData[0].attendance[0].subject)
        }
    }, [attendanceData])

    useEffect(() => {
        let data = attendanceData.map(record => {
            let attendedSubject = record.attendance.find(att => att.subject === selectedSubject && att.attended === true)
            return attendedSubject ? {
                date: new Date(record.date).toISOString().split("T")[0],
                count: 1
            }
                :
                null
        }).filter(Boolean)
        if (data)
            setActivityData(data)
    }, [selectedSubject, attendanceData])

    useEffect(() => {
        let subjectMap = {}
        attendanceData.forEach(record => {
            record.attendance.forEach(att => {
                let subj = att.subject
                if (!subjectMap[subj]) {
                    subjectMap[subj] = {
                        subject: subj,
                        totalClasses: 0,
                        attended: 0,
                        lastAttended: null
                    }
                }
                subjectMap[subj].totalClasses += 1
                if (att.attended) {
                    subjectMap[subj].attended += 1
                    subjectMap[subj].lastAttended = new Date(record.date).toISOString().split("T")[0]
                }
            })
        })
        let result = Object.values(subjectMap).map(entry => ({
            ...entry,
            percentage: ((entry.attended / entry.totalClasses) * 100).toFixed(2)
        }))
        setAnalysedData(result)
    }, [attendanceData])


    return (
        <div className="h-full min-h-screen w-full bg-[#262523] text-white px-20 pb-20" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-semibold" >Attendance Analysis</p>
                <div className="flex gap-12 text-lg font-medium" >
                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{attendanceData[0].semester}</p>
                    <p className="bg-slate-700 rounded-lg px-10 py-2" >{attendanceData[0].branch}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-12" >
                <p className="text-2xl font-semibold" >Subject wise Analysis</p>
                <div className="flex items-center gap-6 text-lg font-medium" >
                    <p className="text-2xl" >Subject: </p>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="outline-none bg-slate-700 px-4 py-2 rounded-lg min-w-32 cursor-pointer" >
                        {attendanceData[0].attendance.map((att, i) => (
                            <option key={i} value={att.subject} >{att.subject}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-between px-32 my-16" >
                <CircularProgress percentage={analysedData.find(data => data.subject === selectedSubject)?.percentage || 0} />
                <Heatmap activityData={activityData} setSelectedDate={setSelectedDate} />
            </div>
            {selectedDate &&
                <div>
                    <p className="text-xl font-medium" >Selected Date: {selectedDate}</p>
                    <div className="w-full text-lg font-bold flex my-12 bg-slate-700" >
                        <p className="w-1/3 text-center border-2 py-4 rounded-l-2xl" >Timings</p>
                        <p className="w-1/3 text-center border-2 py-4" >Subject</p>
                        <p className="w-1/3 text-center border-2 py-4 rounded-r-2xl" >Status</p>
                    </div>
                    <div className="w-full text-lg font-bold flex flex-col my-12 bg-slate-700" >
                        {attendanceData.find(record => record.date.slice(0, 10) === selectedDate)?.attendance?.map((att, i) =>
                            <div key={i} className="w-full text-lg font-bold flex hover:bg-slate-800 transition-opacity duration-500" >
                                <p className="w-1/3 text-center border-2 py-4" >{att.time}</p>
                                <p className="w-1/3 text-center border-2 py-4" >{att.subject}</p>
                                <div className="w-1/3 relative group" >
                                    {att.marked_by_others &&
                                        <p className="absolute -top-4 -right-12 bg-black text-sm px-5 py-2 rounded-lg opacity-0 group-hover:opacity-100" >Marked by: {att.marked_by_others}</p>
                                    }
                                    <p className="text-center border-2 py-4" >{att.attended ? "Attended" : "Not Attended"}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
            <div>
                <p className="text-2xl font-semibold" >Subject-wise Attendance Summary Table</p>
                <div className="w-full text-lg font-bold flex my-12 bg-slate-700" >
                    <p className="w-1/5 text-center border-2 py-4 rounded-l-2xl" >Subject</p>
                    <p className="w-1/5 text-center border-2 py-4" >Total Classes</p>
                    <p className="w-1/5 text-center border-2 py-4" >Attended</p>
                    <p className="w-1/5 text-center border-2 py-4" >Percentage</p>
                    <p className="w-1/5 text-center border-2 py-4 rounded-r-2xl" >Last Attended</p>
                </div>
                <div className="bg-slate-700" >
                    {analysedData.map((data, i) =>
                        <div key={i} className="w-full text-lg font-bold flex hover:bg-slate-800 transition-opacity duration-500" >
                            <p className="w-1/5 text-center border-2 py-4" >{data.subject}</p>
                            <p className="w-1/5 text-center border-2 py-4" >{data.totalClasses}</p>
                            <p className="w-1/5 text-center border-2 py-4" >{data.attended}</p>
                            <p className="w-1/5 text-center border-2 py-4" >{data.percentage}%</p>
                            <p className="w-1/5 text-center border-2 py-4" >{data.lastAttended || "-"}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}