import { useContext } from "react"
import Navbar from "../navbar/navbar"
import { FaCheckCircle, FaCalendarAlt, FaUserFriends, FaChartBar, FaUserEdit, FaCalendarCheck, FaChartLine, FaBook } from "react-icons/fa"
import { Context } from "../App"


export default function Home() {

    let [isSignedin, setIsSignedin] = useContext(Context)
    let username = window.localStorage.getItem("username")

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            {isSignedin ?
                <div className="my-8" >
                    <div className="flex flex-col items-center gap-6 px-8 py-20 bg-gradient-to-br from-indigo-800 to-gray-900" >
                        <p className="text-5xl font-bold text-indigo-200" >Welcome, {username} 👋</p>
                        <p className="w-3/5 mx-auto text-2xl text-gray-300 text-center" >Your personal attendance companion. Mark classes, track performance, and take charge of your academic discipline.</p>
                    </div>
                    <p className="text-3xl font-semibold text-indigo-300 text-center mt-16 mb-8" >✨ What would you like to do today?</p>
                    <div className="flex gap-8 px-40 flex-wrap" >
                        <div className="flex items-center justify-center gap-6 bg-gray-800 p-6 rounded-2xl hover:bg-gray-700 transition flex-1 min-w-[300px]" >
                            <FaCalendarCheck className="text-4xl text-green-400" />
                            <p className="text-xl font-semibold text-indigo-200">Mark Attendance</p>
                        </div>
                        <div className="flex items-center justify-center gap-6 bg-gray-800 p-6 rounded-2xl hover:bg-gray-700 transition flex-1 min-w-[300px]" >
                            <FaChartLine className="text-4xl text-yellow-400" />
                            <p className="text-xl font-semibold text-indigo-200">View Analysis</p>
                        </div>
                        <div className="flex items-center justify-center gap-6 bg-gray-800 p-6 rounded-2xl hover:bg-gray-700 transition flex-1 min-w-[300px]" >
                            <FaUserEdit className="text-4xl text-pink-400" />
                            <p className="text-xl font-semibold text-indigo-200">Edit Profile</p>
                        </div>
                        <div className="flex items-center justify-center gap-6 bg-gray-800 p-6 rounded-2xl hover:bg-gray-700 transition flex-1 min-w-[300px]" >
                            <FaUserFriends className="text-4xl text-blue-300" />
                            <p className="text-xl font-semibold text-indigo-200">Mark for Friends</p>
                        </div>
                        <div className="flex items-center justify-center gap-6 bg-gray-800 p-6 rounded-2xl hover:bg-gray-700 transition flex-1 min-w-[300px]" >
                            <FaBook className="text-4xl text-purple-400" />
                            <p className="text-xl font-semibold text-indigo-200">My Timetable</p>
                        </div>
                    </div>
                    <div className="bg-gray-900 mt-12 pt-6 px-6 text-gray-500 text-sm border-t border-gray-800 flex justify-center gap-1">
                        Need help? Visit the 
                        <p className="underline text-indigo-300">Help Page</p>
                         or learn more 
                         <p className="underline text-indigo-300">About Us</p>.
                    </div>
                </div>
                :
                <div>
                    <div className="bg-gradient-to-br from-indigo-800 to-gray-900 text-center px-8 py-20" >
                        <p className="text-5xl font-extrabold text-indigo-200 mb-8" >Welcome to <span className="text-indigo-400">Attendo</span></p>
                        <p className="w-1/2 text-xl mx-auto mb-6 text-gray-300" >Your personal student attendance tracker designed to help you stay organized, track progress, and analyze class engagement visually.</p>
                        <p className="w-1/6 bg-indigo-500 hover:bg-indigo-600 px-8 py-3 mx-auto rounded-full text-lg font-semibold transition duration-300 cursor-pointer">Get Started</p>
                    </div>
                    <div className="py-16">
                        <p className="text-4xl font-bold text-center mb-12 text-indigo-300">Features</p>
                        <div className="flex flex-wrap gap-6 justify-center" >
                            <div className="w-1/4 bg-gray-800 rounded-xl p-6 space-y-2" >
                                <FaCalendarAlt className="text-3xl text-indigo-400" />
                                <p className="text-xl font-semibold text-indigo-300" >Smart Timetable View</p>
                                <p className="text-gray-300 text-justify" >Automatically displays your branch / semester's timetable and adapts to real-time edits.</p>
                            </div>
                            <div className="w-1/4 bg-gray-800 rounded-xl p-6 space-y-2" >
                                <FaCheckCircle className="text-3xl text-green-400" />
                                <p className="text-xl font-semibold text-indigo-300" >Custom Attendance</p>
                                <p className="text-gray-300 text-justify" >Mark your classes as Attended, Not Attended, or Cancelled. Easily update times or subjects.</p>
                            </div>
                            <div className="w-1/4 bg-gray-800 rounded-xl p-6 space-y-2" >
                                <FaUserFriends className="text-3xl text-yellow-300" />
                                <p className="text-xl font-semibold text-indigo-300" >Public Friend Access</p>
                                <p className="text-gray-300 text-justify" >Help friends keep track by marking attendance for public profiles—no more missing entries.</p>
                            </div>
                            <div className="w-1/4 bg-gray-800 rounded-xl p-6 space-y-2" >
                                <FaChartBar className="text-3xl text-purple-400" />
                                <p className="text-xl font-semibold text-indigo-300" >Analytics & Heatmaps</p>
                                <p className="text-gray-300 text-justify" >Visual insights with bar graphs, heatmaps, and percentage trackers to monitor your habits.</p>
                            </div>
                            <div className="w-1/4 bg-gray-800 rounded-xl p-6 space-y-2" >
                                <FaUserEdit className="text-3xl text-pink-400" />
                                <p className="text-xl font-semibold text-indigo-300" >Custom Profiles</p>
                                <p className="text-gray-300 text-justify" >Update profile photo, branch, semester, and password. Control privacy with one toggle.</p>
                            </div>
                            <div className="w-1/4 bg-gray-800 rounded-xl p-6 space-y-2" >
                                <FaCheckCircle className="text-3xl text-teal-300" />
                                <p className="text-xl font-semibold text-indigo-300" >Daily & Historical Records</p>
                                <p className="text-gray-300 text-justify" >Browse past attendance, view daily breakdowns, and ensure you're staying consistent.</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-900 text-gray-400 text-sm flex gap-2 justify-center">
                        <p>© {new Date().getFullYear()} Attendo. Made for students, by students. </p>|
                        <p className="underline">About</p> |
                        <p className="underline">Help</p>
                    </div>
                </div>
            }
        </div>
    )
}