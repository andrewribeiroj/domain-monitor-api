// Require Packages
const whois = require('whois-json')

const express = require('express');
const { send } = require('express/lib/response');
const router = express.Router()

// Favicon
router.get('/favicon.ico', (req, res) => res.status(204));

// Read
router.get('/:domain?', async (req, res) => {
    try {
        
        const { domain } = req.params

        if(typeof domain === 'undefined')
            return res.send({ error: 'No domain received' })
        
        console.log(`Analyzing ${domain}`)
        
        var resWhois = await whois(`${domain}`, {follow: 3, verbose: true});

        if(resWhois.length < 2)
            return res.send({
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

        return res.send({
            message: 'Currently registered',
            availability: false,
            statuses: domainStatuses
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Something went wrong' })
    }
})

// Export
module.exports = app => app.use('/whois', router)