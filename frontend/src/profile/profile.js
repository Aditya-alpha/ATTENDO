import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import default_profile_photo from "../images/default_profile.png"
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md"
import { LiaEditSolid } from "react-icons/lia"


export default function Profile() {

    let navigate = useNavigate()
    let username = window.localStorage.getItem("username")
    let [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        profile_photo: "",
        branch: "",
        public: false
    })
    let [branchName, setBranchName] = useState("")
    let [semesterValue, setSemesterValue] = useState("")
    let [publicStatus, setPublicStatus] = useState(false)
    let [isBranchEditing, setIsBranchEditing] = useState(false)
    let [isSemesterEditing, setIsSemesterEditing] = useState(false)
    let [isPublicEditing, setIsPublicEditing] = useState(false)

    useEffect(() => {
        async function handleFetchUserInfo() {
            try {
                const response = await fetch(`http://localhost:8000/${username}/profile`, {
                    method: "GET"
                })
                if (response.status === 200) {
                    let data = await response.json()
                    if (data) {
                        setUserInfo(data)
                        setBranchName(data.branch)
                        setSemesterValue(data.semester)
                        setPublicStatus(data.public)
                    }
                }
            }
            catch (error) {
                alert("An error occurred. Please try again.")
            }
        }
        handleFetchUserInfo()
    }, [username])

    async function handleSaveChanges(updatedUserInfo) {
        try {
            const response = await fetch(`http://localhost:8000/${username}/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ updatedUserInfo })
            })
            if (response.status === 200) {
                let data = await response.json()
                setUserInfo(data)
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    function handleEditing(name) {
        if (name === "branch") {
            let updatedUserInfo = { ...userInfo, branch: branchName }
            setUserInfo(updatedUserInfo)
            setIsBranchEditing(false)
            handleSaveChanges(updatedUserInfo)
        }
        else if (name === "semester") {
            let updatedUserInfo = { ...userInfo, semester: semesterValue }
            setUserInfo(updatedUserInfo)
            setIsSemesterEditing(false)
            handleSaveChanges(updatedUserInfo)
        }
        else if (name === "public") {
            let updatedUserInfo = { ...userInfo, public: publicStatus }
            setUserInfo(updatedUserInfo)
            setIsPublicEditing(false)
            handleSaveChanges(updatedUserInfo)
        }
    }

    return (
        <div className="h-full min-h-screen w-full bg-[#262523] text-white px-20 pb-12" >
            <Navbar />
            <div className="h-full w-full mt-6" >
                <p className="text-3xl font-medium" >Profile</p>
                <div className="h-48 w-full relative bg-slate-600 mt-4">
                    <img src={userInfo?.profile_photo || default_profile_photo} alt="profile_photo" className="h-60 w-60 rounded-full cursor-pointer absolute top-16 left-28 p-2 bg-slate-700" />
                </div>
                <div className="bg-slate-700 py-36 pl-28 text-lg font-semibold space-y-2" >
                    <p>Username: &nbsp; {userInfo.username}</p>
                    <p>Email: &nbsp; {userInfo.email}</p>
                    {isBranchEditing ?
                        <div className="flex gap-4 items-center" >
                            <p>Branch:</p>
                            <select value={branchName} onChange={(e) => setBranchName(e.target.value)} className="text-black text-base rounded-lg px-3 outline-none" >
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
                            <MdCheckBox onClick={() => handleEditing("branch")} className="text-2xl cursor-pointer" />
                        </div>
                        :
                        <div className="flex gap-4 items-center" >
                            <p>Branch:</p>
                            <p>{userInfo.branch}</p>
                            <LiaEditSolid onClick={() => setIsBranchEditing(true)} className="text-xl cursor-pointer" />
                        </div>
                    }
                    {isSemesterEditing ?
                        <div className="flex gap-4 items-center" >
                            <p>Semester:</p>
                            <select value={semesterValue} onChange={(e) => setSemesterValue(e.target.value)} className="text-black text-base rounded-lg px-3 outline-none" >
                                <option value="Sem I" >Sem I</option>
                                <option value="Sem II" >Sem II</option>
                                <option value="Sem III" >Sem III</option>
                                <option value="Sem IV" >Sem IV</option>
                                <option value="Sem V" >Sem v</option>
                                <option value="Sem VI" >Sem VI</option>
                                <option value="Sem VII" >Sem VII</option>
                                <option value="Sem VIII" >Sem VIII</option>
                            </select>
                            <MdCheckBox onClick={() => handleEditing("semester")} className="text-2xl cursor-pointer" />
                        </div>
                        :
                        <div className="flex gap-4 items-center" >
                            <p>Semester:</p>
                            <p>{userInfo.semester}</p>
                            <LiaEditSolid onClick={() => setIsSemesterEditing(true)} className="text-xl cursor-pointer" />
                        </div>
                    }
                    {isPublicEditing ?
                        <div className="flex gap-4 items-center" >
                            <p>Profile:</p>
                            <select value={publicStatus} onChange={(e) => setPublicStatus(e.target.value)} className="text-black text-base rounded-lg px-3 outline-none" >
                                <option value={false} >Private</option>
                                <option value={true} >Public</option>
                            </select>
                            <MdCheckBox onClick={() => handleEditing("public")} className="text-2xl cursor-pointer" />
                        </div>
                        :
                        <div className="flex gap-4 items-center" >
                            <p>Profile:</p>
                            <p>{userInfo.public ? "Public" : "Private"}</p>
                            <LiaEditSolid onClick={() => setIsPublicEditing(true)} className="text-xl cursor-pointer" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}