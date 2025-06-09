import { useEffect, useState } from "react"
import Navbar from "../navbar/navbar"

export default function ShowTimeTable() {

    let username = window.localStorage.getItem("username")
    let [ttData, setTtData] = useState({
        branch: "",
        semester: "",
        day: "",
        schedule: []
    })

    let [selectedBranch, setSelectedBranch] = useState("")
    let [selectedSemester, setSelectedSemester] = useState("")
    let [selectedDay, setSelectedDay] = useState("")

    useEffect(() => {
        async function handleFetchUserInfo() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/view_time-table`, {
                    method: "GET"
                })
                if (response.ok) {
                    let data = await response.json()
                    setSelectedBranch(data.branch)
                    setSelectedSemester(data.semester)
                    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                    setSelectedDay(daysOfWeek[new Date().getDay()])
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchUserInfo()
    }, [username])

    useEffect(() => {
        async function handleFetchTTData() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/view_time-table`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ branch: selectedBranch, semester: selectedSemester, day: selectedDay })
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
    }, [username, selectedBranch, selectedSemester, selectedDay])

    return (
        <div className="h-full min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="w-full flex justify-between mt-6" >
                <p className="text-3xl font-medium" >Time-Table</p>
                <div className="flex gap-12" >
                    <div className="h-full relative group" >
                        <p className="w-64 absolute -top-10 -left-16 bg-gray-950 rounded-md px-6 py-1 opacity-0 group-hover:opacity-100" >You can select day from here</p>
                        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="bg-gray-800 hover:bg-gray-900 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 text-lg font-medium outline-none cursor-pointer" >
                            <option value="Monday" >Monday</option>
                            <option value="Tuesday" >Tuesday</option>
                            <option value="Wednesday" >Wednesday</option>
                            <option value="Thursday" >Thursday</option>
                            <option value="Friday" >Friday</option>
                            <option value="Saturday" >Saturday</option>
                            <option value="Sunday" >Sunday</option>
                        </select>
                    </div>
                    <div className="h-full relative group" >
                        <p className="w-72 absolute -top-10 -left-20 bg-gray-950 rounded-md px-5 py-1 opacity-0 group-hover:opacity-100" >You can select semester from here</p>
                        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="bg-gray-800 hover:bg-gray-900 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 text-lg font-medium outline-none cursor-pointer" >
                            <option value="Sem I" >Sem I</option>
                            <option value="Sem II" >Sem II</option>
                            <option value="Sem III" >Sem III</option>
                            <option value="Sem IV" >Sem IV</option>
                            <option value="Sem V" >Sem v</option>
                            <option value="Sem VI" >Sem VI</option>
                            <option value="Sem VII" >Sem VII</option>
                            <option value="Sem VIII" >Sem VIII</option>
                        </select>
                    </div>
                    <div className="h-full relative group" >
                        <p className="w-64 absolute -top-10 -left-7 bg-gray-950 rounded-md px-3 py-1 opacity-0 group-hover:opacity-100" >You can select branch from here</p>
                        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-gray-800 hover:bg-gray-900 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 text-lg font-medium outline-none cursor-pointer" >
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
                </div>
            </div>
            <div className="my-12 flex flex-col gap-8" >
                <div className="flex gap-20 text-xl font-medium" >
                    <p className="w-1/6" >Timings</p>
                    <p className="w-2/5" >Subjects</p>
                </div>
                {ttData?.schedule.map((sch, i) => (
                    <div key={i} className="flex gap-20" >
                        <p className="w-1/6 bg-gray-800 hover:bg-gray-800/50 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 text-lg font-medium" >{sch.time}</p>
                        <p className="w-2/5 bg-gray-800 hover:bg-gray-800/50 transition border-[1px] border-gray-500 rounded-lg px-4 py-2 text-lg font-medium" >{sch.subject}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}