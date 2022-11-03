// Require Packages
const express = require('express')
const router = express.Router()
const whoisFunction = require('../functions/whoisFunction')

const Status = require('../models/Status')

// Middleware
const authMiddleware = require('../middlewares/auth')
// router.use(authMiddleware)

// List
router.get('/', async (req, res) => {
    try {

        const statuses = await Status.find().sort({_id:-1}).populate('domain')

        return res.send({ statuses })

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Cannot list statuses' })
    }
})

// Create
router.post('/', async (req, res) => {
    try {

        const { domain } = req.body

        const verified = await whoisFunction(domain)

        if (verified.availability === true) {
            res.send(verified)
        } else {

            const notification = await Status.create({ 
                ...verified,
                checkInterval: req.body.checkInterval,
                user: req.userId 
            })

            return res.send(notification)

        }

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Cannot create status' })
    }
})

// Read
router.get('/:statusId', async (req, res) => {
    try {

        const statuses = await Status.findById(req.params.notificationId).populate('domain')

        return res.send({ statuses })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot find status' })
    }
})

// Update
router.put('/:statusId', async (req, res) => {
    try {

        const { domain, expirationDate, startDate, checkInterval, completed } = req.body

        const status = await Status.findByIdAndUpdate(req.params.statuses, {
            domain,
            expirationDate,
            startDate,
            checkInterval,
            completed
        }, { new: true })

        await status.save()

        return res.send(status)

    } catch (err) {
        return res.status(400).send({ error: 'Cannot find status' })
    }
})

// Delete
router.delete('/:statusId', async (req, res) => {
    try {

        await Status.findByIdAndRemove(req.params.notificationId).populate('domain')

        return res.send({ message: 'Deleted' })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot delete status' })
    }
})

// Export
module.exports = app => app.use('/statuses', router)