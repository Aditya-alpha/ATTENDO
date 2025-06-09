import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../navbar/navbar"
import { useEffect, useState } from "react"
import Heatmap from "../visualizations/heatmap"
import CircularProgress from "../visualizations/percentageImage"
import AttendanceBarChart from "../visualizations/bargraph"
import { BiToggleLeft, BiToggleRight } from "react-icons/bi"


export default function ShowAnalysis() {

    let navigate = useNavigate()
    let { username } = useParams()
    let [attendanceData, setAttendanceData] = useState([{
        username: username,
        branch: "",
        semester: "",
        date: new Date().toISOString().slice(0, 10),
        attendance: [{
            time: "",
            subject: "",
            attended: null,
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

    let [subjectList, setSubjectList] = useState([])
    let [selectedSubject, setSelectedSubject] = useState("")
    let [activityData, setActivityData] = useState([])
    let [selectedDate, setSelectedDate] = useState("")
    let [typeofAnalysis, setTypeofAnalysis] = useState(false)

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
                else if (response.status === 400) {
                    alert("No attendance records found. First mark attendance then analysis will be available.")
                    navigate(`/${username}/mark_attendance`)
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
            let subjectRecord = record.attendance.find(att => att.subject === selectedSubject)
            return {
                date: new Date(record.date).toISOString().split("T")[0],
                count: subjectRecord?.attended === true ? 1 : subjectRecord?.attended === false ? 0 : -1
            }
        })
        if (data) {
            setActivityData(data)
            setSelectedDate("")
        }
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
                if (att.attended !== null) {
                    subjectMap[subj].totalClasses += 1
                }
                if (att.attended) {
                    subjectMap[subj].attended += 1
                    subjectMap[subj].lastAttended = new Date(record.date).toISOString().split("T")[0]
                }
            })
        })
        let result = Object.values(subjectMap).map(entry => ({
            ...entry,
            percentage: entry.totalClasses > 0
                ? ((entry.attended / entry.totalClasses) * 100).toFixed(2)
                : "0.00"
        }))
        setSubjectList(result.map(res => res.subject))
        setAnalysedData(result)
    }, [attendanceData])

    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


    return (
        <div className="h-full min-h-screen w-full bg-gray-900 text-white px-20 pb-20" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-semibold" >Attendance Analysis</p>
                <div className="flex gap-12 text-lg font-medium" >
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-lg px-10 py-2" >{attendanceData[0]?.semester}</p>
                    <p className="bg-gray-800 border-[1px] border-gray-500 rounded-lg px-10 py-2" >{attendanceData[0]?.branch}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-12" >
                <p className="text-2xl font-semibold" >Subject wise Analysis</p>
                <div className="flex items-center gap-6 text-lg font-medium" >
                    <p className="text-2xl" >Subject: </p>
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="outline-none bg-gray-800 hover:bg-gray-900 transition border-[1px] border-gray-500 px-4 py-2 rounded-lg min-w-32 cursor-pointer" >
                        {subjectList?.map((subject, i) => (
                            <option key={i} value={subject} >{subject}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-between px-16 my-16" >
                <CircularProgress percentage={analysedData.find(data => data.subject === selectedSubject)?.percentage || 0} />
                <Heatmap activityData={activityData} setSelectedDate={setSelectedDate} />
                <div className="flex flex-col gap-12 font-semibold" >
                    <div className="flex gap-1" >
                        <span className="bg-[#16a34a] text-[#16a34a]" >""'"</span>
                        <p>- Attended</p>
                    </div>
                    <div className="flex gap-1" >
                        <span className="bg-[#ef4444] text-[#ef4444]" >""'"</span>
                        <p>- Not Attended</p>
                    </div>
                    <div className="flex gap-1" >
                        <span className="bg-[#eab308] text-[#eab308]" >""'"</span>
                        <p>- Cancelled</p>
                    </div>
                    <div className="flex gap-1" >
                        <span className="bg-[#ffffff] text-[#ffffff]" >""'"</span>
                        <p>- Holiday</p>
                    </div>
                </div>
            </div>
            {selectedDate &&
                <div>
                    <p className="text-xl font-medium" >Selected Date: {selectedDate}</p>
                    <div className="w-full text-lg font-bold flex my-12 bg-gray-800" >
                        <p className="w-1/3 text-center border-[1px] px-3 py-4 rounded-l-2xl" >Timings</p>
                        <p className="w-1/3 text-center border-[1px] px-3 py-4" >Subject</p>
                        <p className="w-1/3 text-center border-[1px] px-3 py-4 rounded-r-2xl" >Status</p>
                    </div>
                    <div className="w-full text-lg font-bold flex flex-col my-12" >
                        {attendanceData.find(record => record.date.slice(0, 10) === selectedDate)?.attendance?.map((att, i) =>
                            <div key={i} className="w-full text-lg font-bold flex bg-gray-800 hover:bg-gray-800/30 transition duration-300" >
                                <p className="w-1/3 text-center border-[1px] px-3 py-4" >{att.time}</p>
                                <p className="w-1/3 text-center border-[1px] px-3 py-4" >{att.subject}</p>
                                <div className="w-1/3 relative group" >
                                    {att.marked_by_others &&
                                        <p className="absolute -top-4 -right-12 bg-black text-sm px-5 py-2 rounded-lg opacity-0 group-hover:opacity-100" >Marked by: {att.marked_by_others}</p>
                                    }
                                    <p className="text-center border-[1px] px-3 py-4" >{att.attended ? "Attended" : att.attended === false ? "Not Attended" : "Cancelled"}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            }
            <div>
                <div className="flex justify-between items-center" >
                    <p className="text-2xl font-semibold" >Attendance Summary Table</p>
                    <div className="flex items-center gap-4 text-2xl font-semibold border-2 border-gray-500 p-3 rounded-lg" >
                        <p>Bar Chart</p>
                        {typeofAnalysis ?
                            <BiToggleRight onClick={() => setTypeofAnalysis(prev => !prev)} className="text-4xl" />
                            :
                            <BiToggleLeft onClick={() => setTypeofAnalysis(prev => !prev)} className="text-4xl" />
                        }
                        <p>Tabular</p>
                    </div>
                </div>
                {!typeofAnalysis ?
                    <div className="flex mt-12 gap-20" >
                        <AttendanceBarChart analysedData={analysedData} type={"attended"} />
                        <AttendanceBarChart analysedData={analysedData} type={"percentage"} />
                    </div>
                    :
                    <div>
                        <div className="w-full text-lg font-bold flex my-12 bg-gray-800" >
                            <p className="w-1/5 text-center border-[1px] px-3 py-4 rounded-l-2xl" >Subject</p>
                            <p className="w-1/5 text-center border-[1px] px-3 py-4" >Total Classes</p>
                            <p className="w-1/5 text-center border-[1px] px-3 py-4" >Attended</p>
                            <p className="w-1/5 text-center border-[1px] px-3 py-4" >Percentage</p>
                            <p className="w-1/5 text-center border-[1px] px-3 py-4 rounded-r-2xl" >Last Attended</p>
                        </div>
                        <div >
                            {analysedData.map((data, i) =>
                                <div key={i} className="w-full text-lg font-bold flex bg-gray-800 hover:bg-gray-800/30 transition duration-300" >
                                    <p className="w-1/5 text-center border-[1px] px-3 py-4" >{data.subject}</p>
                                    <p className="w-1/5 border-[1px] px-3 py-4 flex items-center justify-center" >{data.totalClasses}</p>
                                    <p className="w-1/5 border-[1px] px-3 py-4 flex items-center justify-center" >{data.attended}</p>
                                    <p className="w-1/5 border-[1px] px-3 py-4 flex items-center justify-center" >{data.percentage}%</p>
                                    <p className="w-1/5 border-[1px] px-3 py-4 flex items-center justify-center" >
                                        {data.lastAttended ?
                                            `${data.lastAttended} (${daysOfWeek[new Date(data.lastAttended).getDay()]})`
                                            :
                                            "-"
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}