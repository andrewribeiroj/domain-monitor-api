const cron = require('node-cron')
const whois = require('whois-json')
const mailer = require('../../modules/mailer')

const Notification = require('../models/Notification')

async function whoisFunction(domain) {
    try {
        
        var resWhois = await whois(`${domain}`, {follow: 3, verbose: true});

        if(resWhois.length < 2)
            return ({
                message: 'Possibly not registered',
                availability: true
            })

        const domainStatuses = []

        resWhois.forEach(element => {
            var statusPart = element.data.domainStatus.toLowerCase().split(" ")

            statusPart.forEach(element => {
                if(element.startsWith('http') === false && element.startsWith('(http') === false)
                    if(domainStatuses.indexOf(element) === -1)
                        domainStatuses.push(element)
            })
        })

        return ({
            message: 'Currently registered',
            availability: false,
            statuses: domainStatuses
        })
    } catch (err) {
        console.log(err)
        return ({ error: 'Something went wrong' })
    }
}

async function checkAvailability() {

    try {

        const notifications = await Notification.find({ 'completed': false }).populate('user')

        notifications.forEach(async element => {
            var domain = element.domain
            var result = await whoisFunction(domain)

            if (result.availability === true){

                var update = await Notification.findByIdAndUpdate(element._id, {
                    completed: true
                }, { new: true })

                update.save()

                mailer.sendMail({
                    to: element.user.email,
                    from: 'no-reply@surikt.com',
                    subject: 'Your domain is available!',
                    template: 'domains/domain_availability',
                    context: {domain}
                }, (err) => {
                    if (err){
                        console.log(err)
                    }else{
                        console.log(`Email sent to ${element.user.email} about ${domain}`)
                    }
                })
            }
        })

    } catch (err) {
        console.log(err)
    }

}

module.exports = cron.schedule('*/5 * * * * *', checkAvailability, {
    scheduled: false
})