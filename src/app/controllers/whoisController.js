// Require Packages
const whois = require('whois-json')
const whoisFunction = require('../functions/whoisFunction')
const dig = require('../functions/digFunction')

const express = require('express');
const { send } = require('express/lib/response');
const router = express.Router()

// Favicon
router.get('/favicon.ico', (req, res) => res.status(204));

// Read
router.get('/:domain?/:type?', async (req, res) => {
    if (req.params.type === 'fulldata') {

        try {

            const { domain } = req.params

            if (typeof domain === 'undefined')
                return res.send({ error: 'No domain received' })

            //console.log(`Analyzing ${domain}`)

            var resWhois = await whois(`${domain}`, { follow: 3, verbose: true });

            return res.send({
                resWhois
            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Something went wrong' })
        }

    } else {

        try {

            const { domain } = req.params

            if (typeof domain === 'undefined')
                return res.send({ error: 'No domain received' })

            //console.log(`Analyzing ${domain}`)

            var {
                    message,
                    availability,
                    registrar,
                    registrationDate,
                    expirationDate,
                    statuses,
                    nameservers,
                    dnnssec
                } = await whoisFunction(domain)

            return res.send({
                message,
                availability,
                registrar,
                registrationDate,
                expirationDate,
                statuses,
                nameservers,
                dnnssec
            })
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Something went wrong' })
        }

    }
})

// Export
module.exports = app => app.use('/whois', router)