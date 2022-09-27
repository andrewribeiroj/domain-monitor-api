const axios = require('axios')
require('dotenv').config()

const mysqlApi = axios.create({
    baseURL: `${process.env.MYSQL_API_URL}/api/`
})

module.exports = mysqlApi