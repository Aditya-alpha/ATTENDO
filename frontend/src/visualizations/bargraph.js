import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AttendanceBarChart({ analysedData, type }) {

    let CustomTooltip1 = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let attended = payload.find(p => p.dataKey === 'attended')?.value ?? 0
            let total = payload.find(p => p.dataKey === 'totalClasses')?.value ?? 0
            let percentage = total > 0 ? ((attended / total) * 100).toFixed(1) : '0'

            return (
                <div className="bg-gray-800 text-white p-3 rounded shadow-md">
                    <p className="font-semibold">{label}</p>
                    <p>Attended: {attended}</p>
                    <p>Total Classes: {total}</p>
                    <p>Percentage: {percentage}%</p>
                </div>
            )
        }

        return null
    }


    let CustomTooltip2 = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let { subject, percentage } = payload[0].payload
            return (
                <div className="bg-gray-800 text-white p-3 rounded shadow-lg">
                    <p className="font-semibold">{subject}</p>
                    <p>Attendance: {percentage}%</p>
                </div>
            )
        }

        return null
    }


    if (type === "attended") {
        return (
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" tick={false} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip1 />} />
                        <Legend />
                        <Bar dataKey="attended" fill="#8884d8" name="Attended" />
                        <Bar dataKey="totalClasses" fill="#0ea573" name="Total Classes" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
    else {
        return (
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysedData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" tick={false} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip2 />} />
                        <Legend />
                        <Bar dataKey="percentage" fill="#8884d8" name="Attendance %" label={{ position: 'top' }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
}
