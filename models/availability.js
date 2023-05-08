const mongoose = require('mongoose')

const availabilitySchema = new mongoose.Schema({
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "please interviewer id"],
        ref: "interviewer"
    },
    slots: [{
        _id: false,
        day: {
            type: mongoose.Schema.Types.Number,
            enum: [1, 2, 3, 4, 5, 6, 7]
        },
        time: {
            type: String,
            enum: ["10-11am", "11-12pm", "12-01pm", "01-02pm", "02-03pm", "03-04pm", "04-05pm", "05-06pm", "06-07pm", "07-08pm"]
        }
    }]
})

availabilitySchema.set('timestamps', true)

const Availability = mongoose.model("availability", availabilitySchema)

module.exports = Availability;