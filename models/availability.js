const mongoose = require('mongoose')

const availabilitySchema = new mongoose.Schema({
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interviewer"
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    day: {
        type: mongoose.Schema.Types.Number,
        enum: [0, 1, 2, 3, 4, 5, 6]
    },
})

availabilitySchema.set('timestamps', true)

const Availability = mongoose.model("availability", availabilitySchema)

module.exports = Availability;