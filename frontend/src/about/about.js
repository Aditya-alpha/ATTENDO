import Navbar from "../navbar/navbar"

export default function About() {
    return (
        <div className="min-h-screen w-full bg-gray-900 text-white px-20 pb-12" >
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-10 text-teal-400">About ATTENDO</h1>
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-300">🎯 Our Mission</h2>
                    <p className="text-lg leading-relaxed">At <span className="font-semibold">Attendo</span>, we believe managing your academic attendance should be simple, flexible, and insightful. Our platform empowers students to take control of their attendance records, stay organized, and understand their classroom engagement like never before.
                    </p>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-300">📘 What We Offer</h2>
                    <ul className="space-y-6 text-lg leading-relaxed list-disc list-inside">
                        <li>
                            <span className="font-semibold">Personalized Time-Table Viewer:</span> Easily view your lecture schedule by branch and semester — always know what’s next.
                        </li>
                        <li>
                            <span className="font-semibold">Smart Attendance Tracker:</span> Mark attendance, modify timings, subjects, and account for canceled classes seamlessly.
                        </li>
                        <li>
                            <span className="font-semibold">Peer Attendance Support:</span> Friends can mark attendance on your behalf if your profile is public — collaborative and convenient.
                        </li>
                        <li>
                            <span className="font-semibold">Date-wise Attendance Log:</span> Review past records and know exactly what happened on which day.
                        </li>
                        <li>
                            <span className="font-semibold">Visual Analytics:</span> Gain insights with bar charts, calendar heatmaps, and subject-wise stats — visually track your progress.
                        </li>
                        <li>
                            <span className="font-semibold">Customizable Profile:</span> Edit profile details, update passwords, and manage privacy settings.
                        </li>
                    </ul>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-300">🧠 Why ATTENDO?</h2>
                    <p className="text-lg leading-relaxed">Traditional attendance tools don’t give students flexibility. AttendEase fills this gap by giving you full control. Visual insights, editable logs, and supportive features help you manage and improve your academic attendance effortlessly.</p>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-300">🔐 Privacy & Transparency</h2>
                    <p className="text-lg leading-relaxed">We prioritize your data's safety. All information is stored securely, and you control whether your profile is public or private. Your attendance, your rules.</p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-teal-300">🧑‍💻 Built by Students, for Students</h2>
                    <p className="text-lg leading-relaxed">AttendEase was built with the real struggles of college life in mind. From managing irregular schedules to staying consistent — we’re here to make your journey easier, smarter, and more efficient.</p>
                </section>
            </div>
        </div>
    )
}
