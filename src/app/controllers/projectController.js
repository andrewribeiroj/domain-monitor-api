// Require Packages
const express = require('express')
const router = express.Router()

// Middleware
const authMiddleware = require('../middlewares/auth')
router.use(authMiddleware)

router.get('/', (req,res) => {
    res.json({ ok: true, user: req.userId })
})

module.exports = app => app.use('/projects', router)