// Require Packages
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

// Require Models
const User = require('../models/User')

// Require Other configs
const authConfig = require('../../config/auth')

// Functions
function generateTokens(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

// Routes
// Registration
router.post('/register', async (req, res) => {
    const { email } = req.body
    
    try {
        if (await User.findOne( { email } ))
            return res.status(400).send({ error: 'User already exists!' })

        const user = await User.create(req.body)

        user.password = undefined

        return res.send({
            user,
            token: generateTokens({ id: user.id })
        })
    } catch {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

// Authentication
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return res.status(400).send({ error: 'User not found' })
    }
        
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({ error: 'Invalid password' })
    }

    console.log("Authenticated!")
    user.password = undefined

    res.send({
        user,
        token: generateTokens({ id: user.id })
    })
})

// Forgotten Password
router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).send({ error: 'User not found' })
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        console.log(token, now)

        mailer.sendMail({
            to: email,
            from: 'andrew.ribeiro@outlook.com',
            template: 'auth/forgot_password',
            context: {token}
        }, (err) => {
            if (err){
                return res.status(400).send({ error: 'Cannot send token' })
            }else{
                return res.send()
            }
        })

    } catch (err) {
        res.status(400).send({ error: 'Error' })
    }
})

// Reset Password
router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body

    try{

        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')
        
        if(!user)
            return res.status(400).send({ error: 'User not found' })

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Invalid token' })

        const now = new Date()

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Expired token' })

        user.password = password
        
        await user.save()

        res.send()

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password' })
    }
})

// Exports
module.exports = app => app.use('/auth', router)