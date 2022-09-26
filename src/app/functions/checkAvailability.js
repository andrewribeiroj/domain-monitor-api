const mailer = require('../../modules/mailer')


async function checkAvailability(element, result) {
    if (result.availability === true) {

        var completed = await Notification.findById(element._id)

        if (completed.completed) {
            return true
        }
        else {
            var update = await Notification.findByIdAndUpdate(element._id, {
                completed: true
            }, { new: true })

            update.save()

            mailer.sendMail({
                to: element.user.email,
                from: 'no-reply@surikt.com',
                subject: 'Your domain is available!',
                template: 'domains/domain_availability',
                context: { domain }
            }, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Email sent to ${element.user.email} about ${domain}`)
                }
            })

            return true
        }
    } else {
        if (result.registrationDate > element.createdAt) {
            console.log('Possibly backordered or already registered by a new owner')
        }

        return false
    }
}

module.exports = checkAvailability