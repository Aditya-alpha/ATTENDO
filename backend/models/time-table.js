const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "tt_ATTENDO_db")
const TTdb = mongoose.createConnection(mongoURI)

let TTSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    schedule: [
        {
            time: {
                type: String
            },
            subject: {
                type: String
            }
        }
    ]
})

let TT = TTdb.model("TT", TTSchema)

module.exports = TT