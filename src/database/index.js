// Main Settings
const mongoose = require('mongoose')
require('dotenv').config()

// Mongo Atlas Credentials
const dbuser = process.env.DB_USER
const dbpassword = encodeURIComponent(process.env.DB_PASS)

// const mongourl = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.d9sa0.mongodb.net/avl-ntf-bd?retryWrites=true&w=majority`

const mongourl = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.d9sa0.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(mongourl)
mongoose.Promise = global.Promise

module.exports = mongoose