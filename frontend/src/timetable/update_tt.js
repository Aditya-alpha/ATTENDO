import { useState } from "react"
import { IoMdAdd } from "react-icons/io";


export default function UpdateTimeTable () {

    let [createField, setCreateField] = useState(6)
    let [ttData, setTtData] = useState({
        branch: "Mechanical",
        schedule: Array.from({length: createField}, () => ({
            time: "8:30 am to 9:30 am",
            subject: ""
        }))
    })

    function handleCreateField () {
        if(createField >= 10){
            alert("Cannot add more than 10 fields!")
            return
        }
        setCreateField(prev => prev = prev + 1)
        setTtData(prev => ({...prev, schedule: [...prev.schedule, { time: "8:30 am to 9:30 am", subject: "" }]}))
    }

    function handleFieldChange (e, i, field) {
        let scheduleArray = [...ttData.schedule]
        if(field === "time") {
            scheduleArray[i] = {...scheduleArray[i], time: e.target.value}
        }
        else {
            scheduleArray[i] = {...scheduleArray[i], subject: e.target.value}
        }
        setTtData(prev => ({...prev, schedule: scheduleArray}))
    }

    async function handleSaveTT () {
        let allSubjectsEmpty = ttData.schedule.every(sch => sch.subject.trim() === "")
        if(allSubjectsEmpty) {
            alert("Please enter at least one subject before saving the timetable.")
            return
        }
        let nonEmptySubjectsSchedule = ttData.schedule.filter(sch => sch.subject.trim() !== "")
        let timeSlotsArray = nonEmptySubjectsSchedule.map(sch => sch.time)
        let anyDuplicate = new Set(timeSlotsArray).size !== timeSlotsArray.length
        if(anyDuplicate) {
            alert("Please enter different time-slots for different subjects before saving the timetable.")
            return
        }
        try {
            const response = await fetch("http://localhost:8000/update_time-table", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    branch: ttData.branch,
                    schedule: nonEmptySubjectsSchedule
                })
            })
            let data = await response.json()
            if (response.ok) {
                alert(`${data.message}`)
            }
            else {
                alert(`${data.message}`)
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    return (
        <div className="h-full w-full bg-[#262523] text-white px-20 py-6" >
            <div className="w-full flex justify-between" >
                <p className="text-3xl font-medium" >Update Time-Table</p>
                <select value={ttData.branch} onChange={(e) => setTtData(prev => ({...prev, branch: e.target.value}))} className="bg-slate-700 rounded-lg px-4 py-2 text-lg font-medium" >
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
                    <p className="w-1/5" >Select time</p>
                    <p className="w-full ml-1" >Add subject name</p>
                </div>
                {[...Array(createField)].map((_, i) => 
                <div key={`field_${i}`} className="flex gap-20" >
                    <select value={ttData.schedule[i].time} onChange={(e) => handleFieldChange(e, i, "time")} className="w-1/5 bg-slate-700 rounded-lg px-4 py-1 text-lg font-medium" >
                        <option value="8:30 am to 9:30 am" >8:30 am to 9:30 am</option>
                        <option value="9:30 am to 10:30 am" >9:30 am to 10:30 am</option>
                        <option value="10:30 am to 11:30 am" >10:30 am to 11:30 am</option>
                        <option value="11:30 am to 12:30 pm" >11:30 am to 12:30 pm</option>
                        <option value="12:30 pm to 1:30 pm" >12:30 pm to 1:30 pm</option>
                        <option value="1:30 pm to 2:30 pm" >1:30 pm to 2:30 pm</option>
                        <option value="2:30 pm to 3:30 p" >2:30 pm to 3:30 pm</option>
                        <option value="3:30 pm to 4:30 pm" >3:30 pm to 4:30 pm</option>
                        <option value="4:30 pm to 5:30 pm" >4:30 pm to 5:30 pm</option>
                        <option value="5:30 pm to 6:30 pm" >5:30 pm to 6:30 pm</option>
                    </select>
                    <input value={ttData.schedule[i].subject} onChange={(e) => handleFieldChange(e, i, "subject")} className="px-4 w-full rounded-lg text-black bg-slate-300 font-medium" placeholder="Enter the name of the subject" />
                </div>
                )}
                <div  className="flex self-center gap-8 font-medium text-lg" >
                    <button onClick={handleCreateField} className="w-36 bg-slate-700 p-2 rounded-lg flex gap-2" ><IoMdAdd className="text-3xl" />Add field</button>
                    <button onClick={handleSaveTT} className="w-36 bg-slate-700 p-2 rounded-lg" >Save</button>
                </div>
            </div>
        </div>
    )
}