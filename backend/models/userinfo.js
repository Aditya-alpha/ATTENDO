const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI.replace("<db_name>", "userinfo_ATTENDO_db")
const userinfodb = mongoose.createConnection(mongoURI)

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_photo: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: false
    }
})

let UserInfo = userinfodb.model("UserInfo", userSchema)

module.exports = UserInfo;