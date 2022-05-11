const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
    university: {
        type: String,
        require: true
    },
    course: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
        require: true
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class'
    }
})