import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { RxCross2 } from "react-icons/rx"
import { Context } from "../App"

export default function SignupOTP() {

    let navigate = useNavigate()
    let {setUsername} = useContext(Context)
    let email = window.localStorage.getItem("email")
    let [enteredOtp, setEnteredOtp] = useState("")
    let [isResending, setIsResending] = useState(false)

        async function handleSubmit(e) {
        e.preventDefault()
        if (!enteredOtp.trim()) {
            alert("Please enter the OTP.")
            return
        }
        try {
            const response = await fetch("http://localhost:8000/signup/otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enteredOtp }),
                credentials: "include"
            })
            if (response.ok) {
                let data = await response.json()
                setUsername(data.username)
                window.localStorage.removeItem("email")
                alert(`${data.message}`)
                navigate("/")
            }
            else {
                alert("Incorrect OTP.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again.")
        }
    }

    async function handleResendOtp() {
        setIsResending(true)
        try {
            const response = await fetch("http://localhost:8000/signup/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })
            if (response.ok) {
                alert("A new OTP has been sent to your email.")
            }
            else {
                alert("Unable to resend OTP. Please try again.")
            }
        }
        catch (error) {
            alert("An error occurred while resending OTP.")
        }
        setIsResending(false)
    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-900 text-white">
            <div className="h-96 w-[420px] rounded-lg py-4 px-5 bg-gray-700/70 shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-3xl">Verify</p>
                    <RxCross2 onClick={() => { navigate("/signup"); window.localStorage.removeItem("email") }} className="text-3xl mt-1 -mr-1 cursor-pointer hover:scale-125 transition-all duration-300" />
                </div>
                <p className="my-6">Enter OTP sent on your email</p>
                <form>
                    <input autoFocus type="number" onChange={(e) => setEnteredOtp(e.target.value)} className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block h-12 w-full px-3 rounded-md text-black mt-4 outline-none" />
                    <button onClick={handleSubmit} className="h-12 w-full mt-8 hover:text-lg transition-all duration-200 rounded-full bg-white text-black font-medium" >Submit OTP</button>
                </form>
                <button onClick={handleResendOtp} className={`h-12 w-full mt-7 hover:text-lg transition-all duration-200 rounded-full font-medium text-black ${isResending ? "bg-gray-400 cursor-not-allowed" : "bg-white"}`} >
                    {isResending ? "Resending..." : "Resend OTP"}
                </button>
            </div>
        </div>
    )
}