const cron = require('node-cron')

function checkAvailability() {

    console.log(Date.now())

}

module.exports = cron.schedule('*/10 * * * * *', checkAvailability, {
    scheduled: false
})