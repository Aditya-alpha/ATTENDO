import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RxCross2 } from "react-icons/rx"

export default function ChangePassword() {

    let navigate = useNavigate()

    let email = window.localStorage.getItem("email")

    let [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmNewPassword: ""
    })

    function setData(event) {
        return (setPasswordData((currData) => ({
            ...currData, [event.target.name]: event.target.value
        })))
    }

    function handleCross() {
        window.localStorage.removeItem("email")
        navigate(`/login`)
        alert("Password not changed.")
    }

    async function updatePassword(e) {
        e.preventDefault()
        if(passwordData.newPassword.length < 8) {
            alert("Password must have atleast 8 digits.")
            return
        }
        if(passwordData.newPassword !== passwordData.confirmNewPassword) {
            alert("Make sure the new password match.")
            return
        }
        try {
            const response = await fetch(`https://attendo-h4oc.onrender.com/login/updatepassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({newPassword: passwordData.newPassword, email: email})
            })
            if (response.status === 200) {
                window.localStorage.removeItem("email")
                alert("Password updated successfully !  Now you can login using new password.")
                navigate(`/login`)
            }
            else {
                alert("Internal server error.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again later.")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gray-900">
            <div className="h-80 w-[420px] rounded-lg py-4 px-5 bg-gray-700/70 shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between text-white">
                    <p className="font-medium text-3xl">Change Password</p>
                    <RxCross2 onClick={handleCross} className="text-3xl mt-1 -mr-1 cursor-pointer hover:scale-125 transition-all duration-300" />
                </div>
                <form className="mt-6">
                    <input autoFocus type="password" name="newPassword" placeholder="New password" value={passwordData.newPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8 outline-none" />
                    <input type="password" name="confirmNewPassword" placeholder="Confirm new password" value={passwordData.confirmNewPassword} onChange={setData} className="block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-8 outline-none" />
                    <button onClick={updatePassword} className="h-12 w-full mt-7 hover:text-2xl text-xl transition-all duration-200 rounded-full border-2 border-black bg-white text-black font-semibold" >Update Password</button>
                </form>
            </div>
        </div>
    )
}