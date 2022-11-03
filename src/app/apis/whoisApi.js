const axios = require('axios')

const whoisApi = axios.create({
    baseURL: "http://localhost:8000/whois/"
})

module.exports = whoisApi