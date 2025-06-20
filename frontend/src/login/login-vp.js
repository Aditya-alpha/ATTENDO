import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RxCross2 } from "react-icons/rx";

export default function VerifyOtp() {

    const navigate = useNavigate()

    let email = window.localStorage.getItem("email")

    let [enteredotp, setEnteredotp] = useState("")

    function handleCross() {
        window.localStorage.removeItem("email")
        navigate("/login")
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!enteredotp.trim()) {
            alert("Please enter the OTP.")
            return
        }
        try {
            const response = await fetch("https://attendo-h4oc.onrender.com/login/forgotpassword/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, enteredotp })
            })
            if (response.ok) {
                alert("Otp verified.")
                navigate("/login/updatepassword")
            }
            else {
                alert("Incorrect OTP.")
            }
        }
        catch (error) {
            alert("An error occured. Please try again.")
        }
    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-900">
            <div className="h-72 w-[420px] rounded-lg py-4 px-5 bg-gray-700/70 shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between text-white">
                    <p className="font-medium text-3xl">Verify</p>
                    <RxCross2 onClick={handleCross} className="text-3xl mt-1 -mr-1 cursor-pointer hover:scale-125 transition-all duration-300" />
                </div>
                <p className="my-6 text-white">Enter OTP sent on your email</p>
                <form>
                    <input autoFocus type="number" onChange={(e) => setEnteredotp(e.target.value)} className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none block h-12 w-full px-3 rounded-md placeholder:text-black placeholder:opacity-70 border-2 border-black mt-4 outline-none" />
                    <button onClick={handleSubmit} className="h-12 w-full mt-8 hover:text-2xl text-xl transition-all duration-200 border-2 border-black rounded-full bg-white text-black font-semibold" >Submit OTP</button>
                </form>
            </div>
        </div>
    )
}