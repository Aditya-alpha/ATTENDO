const express = require('express')
const cors = require('cors')
const TT = require("./models/time-table")
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

app.post("/update_time-table", async (req, res) => {
    let {branch, schedule} = req.body
    try {
        await TT.create({ branch, schedule })
        res.status(200).send({message: "Time-Table saved successfully!"})
    }
    catch (error) {
        res.status(500).send({message: "Internal servor error! Please try again."})
    }
})

app.listen(PORT, () => {
    console.log("Server is listening...")
})