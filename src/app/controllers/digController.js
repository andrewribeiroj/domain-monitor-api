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

    const {domain, type} = req.params

    if (typeof type == "undefined" || typeof domain == "undefined"){
        return res.status(400).send({response: "No valid type or domain"})
    } else {
        digFunction(type, domain, (response) => {
            if (typeof response == "number")
                return res.sendStatus(response);
            else
                return res.send(response);
        })
    }

})

// Export
module.exports = app => app.use('/dig', router)