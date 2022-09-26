const cron = require('node-cron')
const whoisFunction = require('../functions/whoisFunction')
const checkAvailability = require('../functions/checkAvailability')
const mysqlAddDomain = require('../functions/mysqlAddDomain')
const mysqlAddProperty = require('../functions/mysqlAddProperty')
const mysqlAddRelationship = require('../functions/mysqlAddRelationship')

const Notification = require('../models/Notification')

async function mainCron() {

    try {

        const notifications = await Notification.find().populate('user')

        notifications.forEach(async element => {
            var domain = element.domain
            // console.log(element)
            var result = await whoisFunction(domain)

            var available = await checkAvailability(element, result)

            if (available === true) {
                mysqlAddDomain(element, result, 1)
            }
            else {
                await mysqlAddDomain(element, result)
                
                await mysqlAddProperty(result.statuses, 'statuses', 'status')
                await mysqlAddProperty(result.nameservers, 'nameservers', 'nameserver')

                await mysqlAddRelationship(element, result.statuses, 'statuses', 'domain_status')
                await mysqlAddRelationship(element, result.nameservers, 'nameservers', 'domain_nameserver')
            }

        })

        //console.log('Cycle ', new Date())

    } catch (err) {
        console.log(err)
    }

}

module.exports = cron.schedule('0 */5 * * * *', mainCron, {
    scheduled: false
})