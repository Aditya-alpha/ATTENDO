import { useState } from "react"
import Navbar from "../navbar/navbar"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const faqs = [
    {
        question: "Can I edit my attendance after marking it?",
        answer: "Yes. You can revisit any day's attendance from the calendar or history view and modify your responses for each subject or timing."
    },
    {
        question: "What if my class schedule changes for the day?",
        answer: "You can edit the time and subject directly before marking attendance. This is useful for rescheduled classes or elective swaps."
    },
    {
        question: "Can I mark attendance for previous dates?",
        answer: "Yes. The platform allows you to select any past date and mark or update attendance, giving flexibility if you forget to mark on time."
    },
    {
        question: "What does “Cancelled” status mean?",
        answer: "If a class was officially not held (e.g., due to holidays, faculty absence), you can leave it unmarked, and the system will consider it as cancelled."
    },
    {
        question: "How does 'Mark for Friends' work?",
        answer: "If your friend has a public profile, you can visit their page and help mark their attendance. This feature is meant to support—not misuse—the system."
    },
    {
        question: "What is the meaning of the colors in the heatmap?",
        answer: "Green indicates attended. Red means not attended. Yellow means cancelled. And white indicates holidays.."
    },
    {
        question: "Is my attendance data private?",
        answer: "By default, your profile and data are private. You can make it public to allow trusted friends to view or assist with marking."
    },
    {
        question: "What happens if I switch semester or branch?",
        answer: "You can update your semester or branch in your Profile settings. Your past data remains preserved and new data starts accumulating accordingly."
    },
    {
        question: "Can I export or download my attendance?",
        answer: "Not yet, but we’re working on an export feature that will let you download your attendance data as a CSV or PDF."
    },
    {
        question: "I forgot my password. How do I reset it?",
        answer: "Visit the login page and click on 'Forgot Password'. You'll receive an otp to reset your password via your registered email."
    }
]

export default function Help() {

    let [openIndex, setOpenIndex] = useState(null)

    function handleToggle (index) {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-10 text-indigo-400">Help & Support</h1>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">🔰 Getting Started</h2>
                    <p className="text-lg leading-relaxed">To begin using <span className="font-semibold">Attendo</span>, create your profile and select your branch and semester. Your schedule will be loaded automatically. From there, you can start marking attendance, editing classes, and exploring your dashboard.</p>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">📝 How to Mark Attendance?</h2>
                    <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
                        <li>Go to the <span className="font-semibold">Mark Attendance</span> section.</li>
                        <li>You’ll see today’s timetable based on your selected semester and branch.</li>
                        <li>You can mark each class as <span className="text-green-400 font-semibold">Attended</span> or <span className="text-red-400 font-semibold">Not Attended</span>.</li>
                        <li>If a class was cancelled, leave it unmarked or edit and set it as “Cancelled”.</li>
                        <li>Changes are saved only after clicking <span className="font-semibold">Save Changes</span>.</li>
                    </ul>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">👥 Marking for Friends</h2>
                    <p className="text-lg leading-relaxed">If your friend's profile is public, you can mark attendance on their behalf from their profile page. This helps when someone misses marking due to network issues or forgetfulness.</p>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">📅 Date-wise Records</h2>
                    <p className="text-lg leading-relaxed">Use the calendar heatmap or pick a date to view detailed attendance. It will show timing, subject, and attendance status for each slot on that day.</p>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">📊 Analytics Explained</h2>
                    <p className="text-lg leading-relaxed">Go to the <span className="font-semibold">Analysis</span> tab to view:</p>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed mt-2">
                        <li><span className="text-white font-semibold">Bar Charts:</span> See how many classes you’ve attended per subject.</li>
                        <li><span className="text-white font-semibold">Heatmap:</span> Visualize which dates had better attendance.</li>
                        <li><span className="text-white font-semibold">Percentage View:</span> Instantly track attendance percentage per subject.</li>
                    </ul>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">🔒 Profile Settings</h2>
                    <p className="text-lg leading-relaxed">Visit the <span className="font-semibold">Profile</span> page to update your photo, branch, semester, or change your password. You can also choose whether to make your profile public or private.</p>
                </section>
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6 text-indigo-300">❓ Frequently Asked Questions</h2>
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-700 py-4">
                            <button onClick={() => handleToggle(index)} className="w-full flex justify-between items-center text-left text-lg font-medium text-white hover:text-blue-400">
                                <span>{faq.question}</span>
                                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {openIndex === index && (
                                <p className="mt-3 text-gray-300 text-base transition-all duration-300">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-300">📩 Need More Help?</h2>
                    <p className="text-lg leading-relaxed">Still stuck? We’re here for you. Reach out via the support email  <span className="text-indigo-200">support@attendo.app</span>.</p>
                </section>
            </div>
        </div>
    )
}
