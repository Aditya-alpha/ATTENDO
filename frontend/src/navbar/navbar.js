import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../App'

export default function Navbar() {

    let navigate = useNavigate()

    let [isSignedin, setIsSignedin] = useContext(Context)
    let username = window.localStorage.getItem("username")

    useEffect(() => {
        setIsSignedin(window.localStorage.getItem("isSignedin"))
    }, [setIsSignedin])

    return (
        <div className="w-full flex justify-between text-lg font-semibold py-5" >
            <p>Attendo</p>
            <div className="flex gap-12" >
                <button onClick={() => navigate("/")} >Home</button>
                <button onClick={() => navigate("/about")} >About</button>
                <button onClick={() => navigate("/help")} >Help</button>
                {isSignedin ?
                    <div className="flex gap-12" >
                        {username === "Aditya Bandral" &&
                            <button onClick={() => navigate("/update_time-table")} >Update TT</button>
                        }
                        <button onClick={() => navigate("/view_time-table")} >View TT</button>
                        <button onClick={() => navigate(`/${username}/mark_attendance`)} >Mark</button>
                        <button onClick={() => navigate(`/${username}/attendance_records`)} >See Records</button>
                        <button onClick={() => navigate(`/${username}/attendance_analysis`)} >Analysis</button>
                        <button onClick={() => navigate(`/${username}/profile`)} >Profile</button>
                    </div>
                    :
                    <button onClick={() => navigate("/login")} >Login</button>
                }
            </div>
        </div>
    )
}