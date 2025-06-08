import { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../App'
import { GiHamburgerMenu } from "react-icons/gi"

export default function Navbar() {

    let navigate = useNavigate()

    let [isSignedin, setIsSignedin] = useContext(Context)
    let username = window.localStorage.getItem("username")
    let [isMenuOpen, setIsMenuOpen] = useState(false)
    let menuRef = useRef()
    let buttonRef = useRef()

    useEffect(() => {
        setIsSignedin(window.localStorage.getItem("isSignedin"))
    }, [setIsSignedin])

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

    function handleLogout() {
        window.localStorage.removeItem("isSignedin")
        window.localStorage.removeItem("username")
        setIsSignedin(false)
        navigate("/")
    }

    return (
        <div className="w-full t-2 flex justify-between items-center text-lg font-semibold py-6 relative" >
            <p>Attendo</p>
            <div className="flex gap-12" >
                <button onClick={() => navigate("/")} >Home</button>
                <button onClick={() => navigate("/about")} >About</button>
                <button onClick={() => navigate("/help")} >Help</button>
                {isSignedin ?
                    <div className='flex gap-12' >
                        <button onClick={() => navigate(`/${username}/mark_attendance`)} >Mark Attendance</button>
                        <button onClick={() => navigate(`/${username}/attendance_analysis`)} >Analysis</button>
                        <GiHamburgerMenu ref={buttonRef} onClick={() => setIsMenuOpen(prev => !prev)} className='text-3xl cursor-pointer' />
                        {isMenuOpen &&
                            <div ref={menuRef} className="absolute right-0 top-16 text-md flex flex-col bg-gray-800 rounded-lg border-[1px] border-gray-500 tracking-wider shadow-lg shadow-gray-950" >
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