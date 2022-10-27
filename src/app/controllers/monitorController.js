// Require Packages
const whoisFunction = require('../functions/whoisFunction')
const digFunction = require('../functions/digFunction')

const express = require('express');
const { send } = require('express/lib/response');
const router = express.Router()

// Favicon
router.get('/favicon.ico', (req, res) => res.status(204));

// Read
router.get('/:domain?/:type?', async (req, res) => {

//    if (req.params.domain.includes(".br"))
//        return res.status(403).send({ error: 'TLD is not supported' })

    try {

        const { domain } = req.params
        var diagnosis

        const resWhois = await whoisFunction(domain)

        const resDig = await digFunction(resWhois.nameservers[0], domain, (response) => {

            response = response.split(' ')
            const status = response.indexOf("status:")

            const nsvalidation = response[status + 1].replace(',', '')

            if (nsvalidation === 'NOERROR')
                diagnosis = 'DNS zone is valid into the server\'s end'
            else if (nsvalidation === 'NXDOMAIN')
                diagnosis = 'DNS zone is valid, but there\'s no record for such hostname'
            else if (nsvalidation === 'REFUSED')
                diagnosis = 'DNS zone is invalid or not created into the server\'s end'
            else
                diagnosis = 'Inconclusive'

            return res.status(400).send({
                whois: resWhois,
                dig: {
                    nsvalidation: nsvalidation,
                    diagnosis: diagnosis
                }
            })

        })

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Something went wrong' })
    }

})

// Export
module.exports = app => app.use('/monitor', router)