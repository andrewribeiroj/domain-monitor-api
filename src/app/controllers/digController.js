// Require Packages
const whoisFunction = require('../functions/whoisFunction')
const digFunction = require('../functions/digFunction')
const dnscode = require('../data/dnsstatus.json')


const express = require('express');
const { send } = require('express/lib/response');
const { response } = require('express')
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
            const type = "ANY"

            const resDig = await digFunction(type, domain, (response) => {
 
                return res.status(400).send({ response: response })

            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Something went wrong' })
        }

    } else if (req.params.type === 'ns-validation') {

        try {

            const { domain } = req.params
            const type = "NS"

            const resDig = await digFunction(type, domain, (response) => {

                return res.status(400).send({ response: response })

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