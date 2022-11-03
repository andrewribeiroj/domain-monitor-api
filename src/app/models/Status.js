const mongoose = require('../../database')

const statusSchema = new mongoose.Schema({
    domain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
        require: true
    },
    registrar: {
        type: String,
        require: true
    },
    registrationDate: {
        type: Date,
        require: true
    },
    expirationDate: {
        type: Date,
        require: true
    },
    statuses: [{
        type: String,
        require: false
    }],
    nameservers: [{
        type: String,
        require: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const status = mongoose.model('Status', statusSchema)

module.exports = status