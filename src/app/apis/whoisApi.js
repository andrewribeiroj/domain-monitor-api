const axios = require('axios')

const whoisApi = axios.create({
    baseURL: "http://localhost:5000/whois/"
})

module.exports = whoisApi