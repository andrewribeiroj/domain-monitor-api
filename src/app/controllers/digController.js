// Require Packages
const whoisFunction = require('../functions/whoisFunction')
const digFunction = require('../functions/digFunction')
const dnscode = require('../data/dnsstatus.json')
const ipInfo = require('../functions/ipFunction')

const express = require('express');
const { send, append } = require('express/lib/response');
const { response } = require('express');
const { json } = require('body-parser');
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
            if (typeof response == "number") {
                return res.sendStatus(response);

            }else {

                answer = []
                response.Answer.forEach(data => {
                    answer.push({'name': data.name, 'data':data.data})
                })

                return res.send({
                    Status: dnscode[response.Status],
                    Question: response.Question,
                    Answer: answer
                })

            }
        })
    }

})

// Export
module.exports = app => app.use('/dig', router)