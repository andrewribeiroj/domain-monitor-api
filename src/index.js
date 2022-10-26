// DOTENV
require('dotenv').config()
const PORT = process.env.PORT
const HOST = process.env.HOST


// EXPRESS
const express = require('express')
const app = express()

// MONGOOSE
const mongoose = require('mongoose')

// URL Encoded
app.use(
    express.urlencoded({
        extended: true,
    })
)
app.use(express.json())

// API Routes
app.get('/', (req,res) => {
    return res.send({ message: 'Successfully connected!' })
})

// Controllers
require('./app/controllers/index')(app)

// Crons
// const checkAvailability = require('./app/crons/checkAvailability')
const CronManager = require('./app/crons/CronManager')

// Serve
app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`)

    //CronManager.run()
})