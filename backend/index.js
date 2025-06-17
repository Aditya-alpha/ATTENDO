const express = require('express')
const cors = require('cors')
const sendEmail = require("./email/email")
const UserInfo = require("./models/userinfo")
const Otp = require("./models/otp")
const TT = require("./models/time-table")
const Attendance = require("./models/store_attendance")
const bcrypt = require('bcrypt')
require("dotenv").config()
const multer = require('multer')
const cloudinary = require("./uploadProfilePhoto")
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const authenticateUser = require('./authenticateUser')

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'posts',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'pdf', 'zip', 'txt'],
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 1024 } })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

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
        let token = jwt.sign({ username: isUser.username, email: isUser.email }, JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).send({ message: "Login successful.", username: isUser.username })
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/login/forgotpassword", async (req, res) => {
    let { email } = req.body
    try {
        let otpsent = Math.floor(100000 + Math.random() * 900000)
        await sendEmail(email, otpsent)
        await Otp.findOneAndUpdate({ email: email }, { email: email, otp: otpsent }, { upsert: true, new: true })
        res.status(200).send("Email sent")
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/login/forgotpassword/verify", async (req, res) => {
    let { email, enteredotp } = req.body
    try {
        let otpdata = await Otp.findOne({ email: email })
        if (otpdata.otp === parseInt(enteredotp)) {
            await Otp.deleteOne({ email })
            res.status(200).send("Otp verified")
        }
        else {
            res.status(403).send("Incorrect OTP")
        }
    }
    catch (error) {
        res.send("Internal server error")
    }
})

app.post("/login/updatepassword", async (req, res) => {
    const newPassword = req.body.newPassword
    const email = req.body.email
    try {
        let userData = await UserInfo.findOne({ email: email })
        if (userData) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await UserInfo.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } }, { new: true })
            res.status(200).send("Password updated successfully")
        }
        else {
            res.status(403).send("User not found")
        }
    }
    catch (error) {
        res.send("Internal server error")
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
                semester: "Sem I"
            })
            let token = jwt.sign({ username: otpdata.username, email: otpdata.email }, JWT_SECRET, { expiresIn: "7d" })
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            await Otp.deleteOne({ email })
            res.status(200).send({ message: "Signup successful!", username: otpdata.username })
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

app.get("/logout", async (req, res) => {
    let token = req.cookies.token
    if (!token) return res.status(401).send("Unauthorized !")
    try {
        res.clearCookie("token")
        res.status(200).send("Logged out successfully")
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.get("/get_username", async (req, res) => {
    let token = req.cookies.token
    if (!token) return res.status(401).send("Unauthorized !")
    try {
        let data = jwt.verify(token, JWT_SECRET)
        res.status(200).json({ username: data.username })
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.get("/check-auth", authenticateUser, (req, res) => {
    res.status(200).json({ authenticated: true, username: req.user.username });
})

app.post("/update_time-table", async (req, res) => {
    let { branch, semester, day, schedule } = req.body
    try {
        await TT.create({ branch, semester, day, schedule })
        res.status(200).send({ message: "Time-Table saved successfully!" })
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.get("/:username/view_time-table", async (req, res) => {
    let { username } = req.params
    try {
        let data = await UserInfo.findOne({ username }).select("branch semester")
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/:username/view_time-table", async (req, res) => {
    let { branch, semester, day } = req.body
    try {
        let data = await TT.findOne({ branch, semester, day })
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal servor error! Please try again." })
    }
})

app.post("/:username/mark_attendance", async (req, res) => {
    let { attendanceData, date, name, type } = req.body
    if (type == "create") {
        try {
            await Attendance.updateOne({ username: name, date }, { $set: attendanceData }, { upsert: true })
            res.status(200).send({ message: "Saved successfully" })
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
    else if (type == "reset") {
        try {
            await Attendance.deleteOne({ username: name, date })
            res.status(200).send({ message: "Reset successful." })
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
    else if (type == "fetchTT") {
        try {
            let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            let user = await UserInfo.findOne({ username: name }).select("branch semester")
            let data = await TT.findOne({ branch: user.branch, semester: user.semester, day: daysOfWeek[new Date(date).getDay()] })
            res.status(200).json(data)
        }
        catch (error) {
            res.status(500).send({ message: "Internal servor error! Please try again." })
        }
    }
    else {
        try {
            let data = await Attendance.findOne({ username: name, date })
            if (data)
                res.status(200).json(data)
            else
                res.status(408).send({ message: "No records found." })
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
        let data = await Attendance.find({ username }).sort({ date: -1 }).limit(1)
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

app.get("/:username/attendance_analysis", async (req, res) => {
    let { username } = req.params
    try {
        let user = await UserInfo.findOne({ username }).select("branch semester")
        let data = await Attendance.find({ username, branch: user.branch, semester: user.semester })
        if (data.length > 0)
            res.status(200).json(data)
        else
            res.status(400).send({ message: "No attendance records found !" })
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
        let data = await UserInfo.findOneAndUpdate({ username }, { $set: updatedUserInfo }, { new: true }).select("username email profile_photo branch semester public")
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error! Please try again." })
    }
})

app.post("/:username/profile/profile_photo", upload.single("profile_photo"), async (req, res) => {
    let { username } = req.params
    let profile_photo = req.file.path
    try {
        let data = await UserInfo.findOneAndUpdate({ username }, { profile_photo }, { new: true }).select("username email profile_photo branch semester public")
        res.status(200).send(data)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/:username/profile/updatepassword", async (req, res) => {
    let { username } = req.params
    let oldpassword = req.body.oldPassword
    let newpassword = req.body.newPassword
    try {
        let userData = await UserInfo.findOne({ username: username })
        if (!userData) {
            return res.status(404).send({ message: "User not found." });
        }
        const isPasswordValid = await bcrypt.compare(oldpassword, userData.password);
        if (!isPasswordValid) {
            return res.status(403).send({ message: "Old password is incorrect." });
        }
        const hashedNewPassword = await bcrypt.hash(newpassword, 10)
        await UserInfo.findOneAndUpdate({ username: username }, { password: hashedNewPassword }, { new: true })
        res.status(200).send({ message: "Password updated successfully." })

    }
    catch (error) {
        res.status(500).send({ message: "Internal server error. Please try again later." })
    }
})

app.listen(PORT, () => {
    console.log("Server is listening...")
})