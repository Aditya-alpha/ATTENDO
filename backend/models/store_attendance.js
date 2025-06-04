const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "attendance_ATTENDO_db")
const Attendancedb = mongoose.createConnection(mongoURI)

let AttendanceSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    attendance: [
        {
            time: {
                type: String
            },
            subject: {
                type: String
            },
            attended: {
                type: Boolean
            },
            marked_by_others: {
                type: String
            }
        }
    ]
})

let Attendance = Attendancedb.model("Attendance", AttendanceSchema)

module.exports = Attendance