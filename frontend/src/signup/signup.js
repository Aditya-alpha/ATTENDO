import { useState } from "react"
import { RxCross2 } from "react-icons/rx"
import { useNavigate } from "react-router-dom"
import default_profile_photo from "../images/default_profile.png"

export default function Signup() {

    let navigate = useNavigate()

    let [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        password: "",
        profile_photo: default_profile_photo
    })

    let [isFetching, setIsFetching] = useState(false)

    function handleInputChange(event) {
        setUserInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    }

    async function handleSignup(e) {
        e.preventDefault()
        let areAllFieldsFilled = Object.values(userInfo).some((value) => value.trim() === "")
        if (areAllFieldsFilled) {
            alert("Please fill out all fields before proceeding.")
            return
        }
        if (!userInfo.email.endsWith("vjti.ac.in")) {
            alert("Email must be a valid Gmail address (e.g., example@xyz.vjti.ac.in).")
            return
        }
        if (userInfo.password.length < 8) {
            alert("Password must contain atleast 8 characters.")
            return
        }
        setIsFetching(true)
        try {
            let response = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(userInfo)
            })
            const data = await response.json()
            if (response.ok) {
                window.localStorage.setItem("username", userInfo.username)
                window.localStorage.setItem("email", userInfo.email)
                navigate("/signup/otp")
            }
            else if (response.status === 408) {
                alert(`${data.message}`)
            }
            else if (response.status === 409) {
                alert(`${data.message}`)
            }
            else {
                alert("An unexpected error occured.")
            }
        }
        catch (error) {
            alert("An error occurred during sign-up. Please refresh and try again.");
            navigate("/")
        }
        setIsFetching(false)
    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-[#262523] text-white">
            <div className="h-[500px] w-[420px] rounded-lg py-4 px-5 bg-[#0e0e0e] opacity-90 shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-3xl">Sign up</p>
                    <RxCross2 onClick={() => navigate("/")} className="text-3xl mt-1 -mr-1 cursor-pointer hover:scale-125 transition-all duration-300" />
                </div>
                <form method="post" action="/signup" className="mt-5">
                    <input type="text" name="username" placeholder="Username" value={userInfo.username} onChange={handleInputChange} className="block h-12 w-full px-3 rounded-md text-black mt-4" />
                    <input type="text" name="email" placeholder="Email" value={userInfo.email} onChange={handleInputChange} className="block h-12 w-full px-3 rounded-md text-black mt-4" />
                    <input type="password" name="password" placeholder="Password" value={userInfo.password} onChange={handleInputChange} className="block h-12 w-full px-3 rounded-md text-black mt-4" />
                    <p className="w-44 hover:scale-105 transition-all duration-300 mt-4 font-medium cursor-pointer underline" onClick={() => navigate("/login")}>Already a user? Log in</p>
                    <button onClick={handleSignup} className={`h-12 w-full mt-5 hover:text-2xl transition-all duration-200 rounded-full text-black text-xl font-semibold ${isFetching ? "bg-gray-400 cursor-not-allowed" : "bg-white"}`} >Sign up</button>
                </form>
                <div className="flex items-center mt-5">
                    <hr className="flex-grow" />
                    <p className="px-3 font-medium -mt-1">or</p>
                    <hr className="flex-grow" />
                </div>
                <button className={`h-12 w-full mt-5 text-lg hover:text-xl transition-all duration-200 rounded-full font-semibold text-black ${isFetching ? "bg-gray-400 cursor-not-allowed" : "bg-white"}`}>Sign in with Google</button>
            </div>
        </div>
    )
}