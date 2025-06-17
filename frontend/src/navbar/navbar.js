import { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../App'
import { GiHamburgerMenu } from "react-icons/gi"
import logo from "../images/attendo_logo.png"

export default function Navbar() {

    let navigate = useNavigate()

    let { username, setUsername } = useContext(Context)
    let [isMenuOpen, setIsMenuOpen] = useState(false)
    let menuRef = useRef()
    let buttonRef = useRef()

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    async function handleLogout() {
        try {
            const response = await fetch("https://attendo-h4oc.onrender.com/logout", {
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
        <div className="w-full t-2 flex justify-between items-center text-lg font-semibold relative" >
            <img src={logo} onClick={() => navigate("/")} className='h-16 w-24 cursor-pointer' />
            <div className="flex gap-12 py-8" >
                <button onClick={() => navigate("/")} >Home</button>
                <button onClick={() => navigate("/about")} >About</button>
                <button onClick={() => navigate("/help")} >Help</button>
                {username ?
                    <div className='flex gap-12' >
                        <button onClick={() => navigate(`/${username}/mark_attendance`)} >Mark Attendance</button>
                        <button onClick={() => navigate(`/${username}/attendance_analysis`)} >Analysis</button>
                        <GiHamburgerMenu ref={buttonRef} onClick={() => setIsMenuOpen(prev => !prev)} className='text-3xl cursor-pointer' />
                        {isMenuOpen &&
                            <div ref={menuRef} className="absolute right-0 top-16 z-50 text-md flex flex-col bg-gray-800 rounded-lg border-[1px] border-gray-500 tracking-wider shadow-lg shadow-gray-950" >
                                {username === "Aditya Bandral" &&
                                    <button onClick={() => navigate("/update_time-table")} className='hover:bg-gray-700 px-8 py-2 rounded-tl-lg rounded-tr-lg transition duration-200' >Update TT</button>
                                }
                                <button onClick={() => navigate(`/${username}/view_time_table`)} className='hover:bg-gray-700 px-8 py-2 transition duration-200' >View TT</button>
                                <button onClick={() => navigate(`/${username}/mark_for_friend`)} className='hover:bg-gray-700 px-8 py-2 transition duration-200' >Mark for friends</button>
                                <button onClick={() => navigate(`/${username}/attendance_records`)} className='hover:bg-gray-700 px-8 py-2 transition duration-200' >See Records</button>
                                <button onClick={() => navigate(`/${username}/profile`)} className='hover:bg-gray-700 px-8 py-2 transition duration-200' >Profile</button>
                                <button onClick={handleLogout} className='hover:bg-red-500 px-8 py-2 rounded-bl-lg rounded-br-lg transition duration-200' >Log Out</button>
                            </div>
                        }
                    </div>
                    :
                    <button onClick={() => navigate("/login")} >Login</button>
                }
            </div>
        </div>
    )
}