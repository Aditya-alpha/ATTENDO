const express = require('express')
const cors = require('cors')
const sendEmail = require("./email/email")
const UserInfo = require("./models/userinfo")
const Otp = require("./models/otp")
const TT = require("./models/time-table")
const Attendance = require("./models/store_attendance")
const bcrypt = require('bcrypt')
require("dotenv").config()

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}

const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOptions))

app.get("/", () => {
    console.log("Hello")
})

app.post("/login", async (req, res) => {
    let { email, password } = req.body
    try {
        let isUser = await UserInfo.findOne({ email })
        if (!isUser) {
            return res.status(404).send({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, isUser.password);
        if (!isPasswordValid) {
            return res.status(403).send({ message: "Password is incorrect" });
        }
        return res.status(200).send(isUser)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/signup", async (req, res) => {
    let { username, email, password, profile_photo } = req.body
    try {
        let isUser = await UserInfo.findOne({ $or: [{ username: username }, { email: email }] })
        if (isUser) {
            if (isUser.username === username) {
                res.status(408).send({ "message": "Username already exists." })
                return
            }
            if (isUser.email === email) {
                res.status(409).send({ "message": "Email already in use. You can login using this email" })
                return
            }
        }
        let otp = Math.floor(100000 + Math.random() * 900000)
        await sendEmail(email, otp)
        let hashedPassword = await bcrypt.hash(password, 10)
        await Otp.findOneAndUpdate({ email: email }, { username: username, email: email, password: hashedPassword, otp: otp, profile_photo: profile_photo }, { upsert: true, new: true })
        return res.status(200).json("Success")
    }
    catch (error) {
        return res.status(500).json("Internal server error")
    }
})

app.post("/signup/otp", async (req, res) => {
    let { email, enteredOtp } = req.body
    try {
        let otpdata = await Otp.findOne({ email: email })
        if (otpdata.otp === parseInt(enteredOtp)) {
            let branchCode = email.split("@")[1].split(".")[0]
            let branch
            if (branchCode === "et") branch = "ExTC"
            else if (branchCode === "el") branch = "Electrical"
            else if (branchCode === "me") branch = "Mechanical"
            else if (branchCode === "it") branch = "Information Technology"
            else if (branchCode === "cs") branch = "Computer Science"
            else if (branchCode === "ec") branch = "Electronics"
            else if (branchCode === "cv") branch = "Civil"
            else if (branchCode === "pd") branch = "Production"
            else if (branchCode === "te") branch = "Textile"
            else branch = "Mechanical"
            await UserInfo.create({
                username: otpdata.username,
                email: otpdata.email,
                password: otpdata.password,
                profile_photo: otpdata.profile_photo,
                branch: branch,
                semester: "Sem 1"
            })
            await Otp.deleteOne({ email })
            res.status(200).send({ message: "Signup successful!" })
        }
        else {
            res.status(403).send("Incorrect OTP")
        }
    }
    catch (error) {
        res.json("Internal server error")
    }
})

app.post("/signup/resend-otp", async (req, res) => {
    let { email } = req.body
    try {
        let otpData = await Otp.findOne({ email: email })
        if (!otpData) {
            return res.status(404).send({ message: "No OTP request found for this email. Please sign up again." })
        }
        let otpsent = Math.floor(100000 + Math.random() * 900000)
        await sendEmail(email, otpsent)
        await Otp.findOneAndUpdate(
            { email: email },
            { otp: otpsent, createdAt: new Date() },
            { new: true }
        )
        res.status(200).send({ message: "New OTP sent successfully" })
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/update_time-table", async (req, res) => {
    let { branch, semester, schedule } = req.body
    try {
        await TT.create({ branch, semester, schedule })
        res.status(200).send({ message: "Time-Table saved successfully!" })
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/view_time-table", async (req, res) => {
    let { branch, semester } = req.body
    try {
        let data = await TT.findOne({ branch, semester })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.get("/:username/mark_attendance", async (req, res) => {
    let { username } = req.params
    try {
        let user = await UserInfo.findOne({ username }).select("branch semester")
        let data = await TT.findOne({ branch: user.branch, semester: user.semester })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/:username/mark_attendance", async (req, res) => {
    let { attendanceData, name, type } = req.body
    if (type == "create") {
        try {
            await Attendance.updateOne({ username: name, date: new Date().toISOString().slice(0, 10) }, { $set: attendanceData }, { upsert: true })
            res.status(200).send({ message: "Saved successfully" })
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
    else if (type == "reset") {
        try {
            await Attendance.deleteOne({ username: name, date: new Date().toISOString().slice(0, 10) })
            res.status(200).send({ message: "Reset successful." })
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
    else {
        try {
            let data = await Attendance.findOne({ username: name, date: new Date().toISOString().slice(0, 10) })
            res.status(200).json(data)
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
})

app.get("/:username/mark_for_friend", async (req, res) => {
    let { username } = req.params
    try {
        let data = await Attendance.find({ "attendance.marked_by_others": username })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/:username/mark_for_friend", async (req, res) => {
    let { friendName, type } = req.body
    if (type === "search") {
        try {
            let data = await UserInfo.find({ username: { $regex: friendName, $options: 'i' } }).select("username branch public")
            if (data)
                res.status(200).json(data)
            else
                res.status(404).json({ message: "User not found !" })
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
    else if (type === "fetchTT") {
        try {
            let user = await UserInfo.findOne({ username: friendName }).select("branch semester")
            let data = await TT.findOne({ branch: user.branch, semester: user.semester })
            res.status(200).json(data)
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
})

app.get("/:username/attendance_records", async (req, res) => {
    let { username } = req.params
    try {
        let data = await Attendance.find({ username }).sort({ date: -1}).limit(1)
        if (data.length > 0) {
            res.status(200).json(data[0])
        }
        else {
            res.status(400).send({ message: "No attendance record found for this date." })
        }
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/:username/attendance_records", async (req, res) => {
    let { targetDate } = req.body
    let { username } = req.params
    try {
        let data = await Attendance.findOne({ username, date: targetDate })
        if (data) {
            res.status(200).json(data)
        }
        else {
            res.status(408).json({ message: "No attendance record found for this date." })
        }
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.get("/:username/profile", async (req, res) => {
    let { username } = req.params
    try {
        let data = await UserInfo.findOne({ username }).select("username email profile_photo branch semester public")
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/:username/profile", async (req, res) => {
    let { username } = req.params
    let { updatedUserInfo } = req.body
    try {
        let data = await UserInfo.findOneAndUpdate({ username }, { $set: updatedUserInfo }, { new: true })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error! Please try again." })
    }
})

app.listen(PORT, () => {
    console.log("Server is listening...")
})