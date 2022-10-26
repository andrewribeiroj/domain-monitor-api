// Main Settings
const mongoose = require('mongoose')

// Mongo Atlas Credentials
const dbuser = process.env.DB_USER
const dbpassword = encodeURIComponent(process.env.DB_PASS)
const dburl = process.env.DB_URL

// const mongourl = `mongodb+srv://${dbuser}:${dbpassword}@cluster0.d9sa0.mongodb.net/avl-ntf-bd?retryWrites=true&w=majority`

const mongourl = `mongodb+srv://${dbuser}:${dbpassword}@${dburl}/?retryWrites=true&w=majority`
mongoose.connect(mongourl)
mongoose.Promise = global.Promise

module.exports = mongoose