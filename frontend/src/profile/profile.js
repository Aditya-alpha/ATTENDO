import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import default_profile_photo from "../images/default_profile.png"
import { MdCheckBox } from "react-icons/md"
import { LiaEditSolid } from "react-icons/lia"
import { RxCross2 } from "react-icons/rx"
import { Context } from "../App"


export default function Profile() {

    let navigate = useNavigate()
    let { username, setUsername } = useContext(Context)
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
        if (!username) return
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

    async function handleSaveProfilePhoto(profile_photo) {
        let formData = new FormData()
        formData.append("profile_photo", profile_photo)
        try {
            const response = await fetch(`http://localhost:8000/${username}/profile/profile_photo`, {
                method: "POST",
                body: formData
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

    function handleProfilePhotoChange(e) {
        let file = e.target.files[0]
        if (file) {
            let confirmSave = window.confirm("Do you want to change the profile photo ?")
            if (confirmSave) {
                handleSaveProfilePhoto(file)
            }
        }
    }

    function handleChangePassword() {
        window.localStorage.setItem("email", userInfo.email)
        navigate(`/${username}/profile/updatepassword`)
    }

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:8000/logout", {
                method: "GET",
                credentials: "include"
            })
            if (response.ok) {
                setUsername(null)
                navigate("/")
            }
            else {
                alert("Failed to logout.")
            }
        }
        catch (error) {
            alert("An error occurred. Please try again.")
        }
    }

    return (
        <div className="h-full min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="h-full w-full mt-6" >
                <p className="text-3xl font-medium" >Profile</p>
                <div className="h-48 w-full bg-gray-700 mt-4">
                    <div className="group relative" >
                        <img src={userInfo?.profile_photo || default_profile_photo} alt="profile_photo" className="h-60 w-60 rounded-full absolute top-16 left-28 p-2 bg-gray-800" />
                        <label>
                            <input type="file" className="hidden" onChange={(e) => handleProfilePhotoChange(e)} />
                            <LiaEditSolid className="h-[224px] w-[224px] absolute top-[72px] left-[120px] p-24 rounded-full z-50 text-2xl opacity-0 group-hover:opacity-100 group-hover:bg-opacity-50 transition-opacity duration-200 text-black bg-gray-300 cursor-pointer" />
                        </label>
                    </div>
                </div>
                <div className="bg-gray-800 py-36 pl-28 text-lg font-semibold flex flex-col gap-3 items-start" >
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
                            <RxCross2 onClick={() => setIsBranchEditing(false)} className="bg-white text-black cursor-pointer rounded-sm" />
                            <MdCheckBox onClick={() => handleEditing("branch")} className="text-2xl cursor-pointer" />
                        </div>
                        :
                        <div className="flex gap-4 items-center" >
                            <p>Branch:</p>
                            <p>{userInfo.branch}</p>
                            <LiaEditSolid onClick={() => { setIsBranchEditing(true); setIsSemesterEditing(false); setIsPublicEditing(false) }} className="text-xl cursor-pointer" />
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
                            <RxCross2 onClick={() => setIsSemesterEditing(false)} className="bg-white text-black cursor-pointer rounded-sm" />
                            <MdCheckBox onClick={() => handleEditing("semester")} className="text-2xl cursor-pointer" />
                        </div>
                        :
                        <div className="flex gap-4 items-center" >
                            <p>Semester:</p>
                            <p>{userInfo.semester}</p>
                            <LiaEditSolid onClick={() => { setIsSemesterEditing(true); setIsBranchEditing(false); setIsPublicEditing(false) }} className="text-xl cursor-pointer" />
                        </div>
                    }
                    {isPublicEditing ?
                        <div className="flex gap-4 items-center" >
                            <p>Profile:</p>
                            <select value={publicStatus} onChange={(e) => setPublicStatus(e.target.value)} className="text-black text-base rounded-lg px-3 outline-none" >
                                <option value={false} >Private</option>
                                <option value={true} >Public</option>
                            </select>
                            <RxCross2 onClick={() => setIsPublicEditing(false)} className="bg-white text-black cursor-pointer rounded-sm" />
                            <MdCheckBox onClick={() => handleEditing("public")} className="text-2xl cursor-pointer" />
                        </div>
                        :
                        <div className="flex gap-4 items-center" >
                            <p>Profile:</p>
                            <p>{userInfo.public ? "Public" : "Private"}</p>
                            <LiaEditSolid onClick={() => { setIsPublicEditing(true); setIsSemesterEditing(false); setIsBranchEditing(false) }} className="text-xl cursor-pointer" />
                        </div>
                    }
                    <div className="flex flex-col gap-5" >
                        <button onClick={handleChangePassword} className="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-900 transition-all duration-200 cursor-pointer" >Change Password</button>
                        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-700 transition-all duration-200 cursor-pointer" >Log out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}