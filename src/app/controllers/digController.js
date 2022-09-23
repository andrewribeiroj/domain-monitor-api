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

    if (req.params.domain.includes(".br"))
        return res.status(403).send({ error: 'TLD is not supported' })

    if (req.params.type === 'fulldata') {

        try {

            const { domain } = req.params

            const resWhois = await whoisFunction(domain)

            const resDig = await digFunction(resWhois.nameservers[0], domain, (response) => {

                response = response.split(' ')
                return res.status(400).send({ response: response })

            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Something went wrong' })
        }

    } else if (req.params.type === 'ns-validation') {

        try {

            const { domain } = req.params

            const resWhois = await whoisFunction(domain)

            const resDig = await digFunction(resWhois.nameservers[0], domain, (response) => {

                response = response.split(' ')
                const status = response.indexOf("status:")

                response[status + 1] = response[status + 1].replace(',', '')

                return res.status(400).send({ response: response[status + 1] })

            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Something went wrong' })
        }

    } else {

        return res.status(400).send({ error: 'Please select type (fulldata, ns-validation)' })

    }
})

// Export
module.exports = app => app.use('/dig', router)