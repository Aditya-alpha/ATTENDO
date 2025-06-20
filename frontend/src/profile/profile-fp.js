import { useNavigate } from "react-router-dom"
import { RxCross2 } from "react-icons/rx"

export default function ForgotProfilePassword() {

    const navigate = useNavigate()

    let username = window.localStorage.getItem("username")
    let email = window.localStorage.getItem("email")

    function handleCross() {
        navigate(`/${username}/profile/updatepassword`)
    }

    function handleProceed() {
        navigate(`/${username}/profile/forgotpassword/verify`)
        sendOtp()
    }

    async function sendOtp() {
        try {
            const response = await fetch("https://attendo-h4oc.onrender.com/login/forgotpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email })
            })
            if (!response.ok) {
                alert("Failed to send OTP.")
                navigate(`/${username}/profile/updatepassword`)
            }
        }
        catch (error) {
            alert("An error occurred during log-in. Please try again.")
            window.localStorage.removeItem("email")
            navigate(`/${username}/profile/updatepassword`)
        }

    }

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gray-900">
            <div className="h-56 w-[600px] rounded-lg py-6 px-5 text-white bg-gray-700/70 shadow-2xl hover:scale-105 transition-all duration-300 max-sm:mx-4">
                <div className="flex justify-between">
                    <p className="font-medium text-2xl">Forgot Password</p>
                    <RxCross2 onClick={handleCross} className="text-3xl mt-1 -mr-1 cursor-pointer hover:scale-125 transition-all duration-300" />
                </div>
                <div>
                    <p className="my-6 pl-[2px]" >You will get a verification code on XXXXXXX{email.slice(-16)}</p>
                    <button onClick={handleProceed} className="h-12 w-full mt-2 hover:text-2xl text-xl transition-all duration-200 rounded-full border-2 border-black bg-white text-black font-semibold">Press to proceed</button>
                </div>
            </div>
        </div>
    )
}