const cron = require('node-cron')
const whoisFunction = require('../functions/whoisFunction')
const checkAvailability = require('../functions/checkAvailability')
const mysqlAddDomain = require('../functions/mysqlAddDomain')
const mysqlAddProperty = require('../functions/mysqlAddProperty')
const mysqlAddRelationship = require('../functions/mysqlAddRelationship')

const Notification = require('../models/Notification')
const Status = require('../models/Status')

async function mainCron() {

    try {

        const notifications = await Notification.find().populate('user')

        notifications.forEach(async element => {
            var domain = element.domain
            // console.log(element)
            var result = await whoisFunction(domain)

            var available = await checkAvailability(element, result)

            if(available === true){
                console.log(element.domain + ' is available')
            }else {
                console.log(element.domain + ' is registered')
            }
            
            if (available === false) {

                const status = await Status.create({ 
                    domain: element._id,
                    registrar: result.registrar,
                    registrationDate: result.expirationDate,
                    statuses: result.statuses,
                    nameservers: result.nameservers
                })

                console.log(status)
            }
        })

    } catch (err) {
        console.log(err)
    }

}

module.exports = cron.schedule('0 * * * * *', mainCron, {
    scheduled: false
})