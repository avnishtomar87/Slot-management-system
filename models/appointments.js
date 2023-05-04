const mongoose = require('mongoose')

const appoinmentsSchema = new mongoose.Schema({
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interviewer"
    },
    intervieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interviewee"
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
appoinmentsSchema.set('timestamps', true)

const Appointment = mongoose.model("appoinments", appoinmentsSchema)

module.exports = Appointment;