// Require Packages
const express = require('express')
const router = express.Router()

const Notification = require('../models/Notification')

// Middleware
const authMiddleware = require('../middlewares/auth')
router.use(authMiddleware)

// List
router.get('/', async (req,res) => {
    try{

        const notifications = await Notification.find().populate('user')

        return res.send({ notifications })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot list notifications' })
    }
})

// Create
router.post('/', async (req, res) => {
    try{

        const notification = await Notification.create({ ...req.body, user: req.userId })

        return res.send( notification )

    } catch (err) {
        return res.status(400).send({ error: 'Cannot create notification' })
    }
})

// Read
router.get('/:notificationId', async (req, res) => {
    try{

        const notifications = await Notification.findById(req.params.notificationId).populate('user')

        return res.send({ notifications })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot find notification' })
    }
})

// Update
router.put('/:notificationId', async (req, res) => {
    try{

        const { domain, expirationDate, startDate, checkInterval, completed } = req.body

        const notification = await Notification.findByIdAndUpdate(req.params.notificationId, {
            domain,
            expirationDate,
            startDate,
            checkInterval,
            completed
        }, { new: true })

        await notification.save()

        return res.send( notification )

    } catch (err) {
        return res.status(400).send({ error: 'Cannot find notification' })
    }
})

// Delete
router.delete('/:notificationId', async (req, res) => {
    try{

        await Notification.findByIdAndRemove(req.params.notificationId).populate('user')

        return res.send({ message: 'Deleted' })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot delete notification' })
    }
})

module.exports = app => app.use('/notifications', router)