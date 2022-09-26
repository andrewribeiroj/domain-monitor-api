const axios = require('axios')

const digApi = axios.create({
    baseURL: "http://localhost:5000/dig/"
})

module.exports = digApi