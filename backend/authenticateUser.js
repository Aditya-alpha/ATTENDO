const jwt = require('jsonwebtoken')
require("dotenv").config()

const authenticateUser = (req, res, next) => {
    let token = req.cookies.token
    if (!token) {
        return res.status(401).json({ authenticated: false, message: "No token provided" })
    }
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ authenticated: false, message: "Invalid or expired token" })
    }
}

module.exports = authenticateUser
