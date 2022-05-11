// DOTENV
require('dotenv').config()
const PORT = process.env.PORT

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

// Auth
require('./app/controllers/index')(app)

// Serve
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))