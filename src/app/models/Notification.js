const mongoose = require('../../database')

const notificationSchema = new mongoose.Schema({
    domain: {
        type: String,
        require: true
    },
    expirationDate: {
        type: Date,
        require: true
    },
    startDate: {
        type: Date,
        require: true
    },
    checkInterval: {
        type: Number,
        default: 43200
    },
    lastCheck: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed: {
        type: Boolean,
        require: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const notification = mongoose.model('Notification', notificationSchema)

module.exports = notification