const axios = require('axios')

const mysqlApi = axios.create({
    baseURL: "http://localhost:8000/api/"
})

module.exports = mysqlApi