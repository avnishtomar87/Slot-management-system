const AppError = require("../utils/appError");
const Availability = require("../models/availability")
// const catchAsync = require("../utils/catchAsync");

const filterSlots = (slots, day, time) => {
    const filteredSlots = slots.filter((item) => item.day !== day && item.time !== time);
    return filteredSlots
}

const checkInterviewerAvailability = async (interviewerId, day, time, next) => {
    const availability = await Availability.findOne({ interviewerId })
    if (!availability || !availability.slots) {
        return next(new AppError("Interviewer Not available for the given time", 400));

    }
    const slots = availability.slots;
    let obj = slots.find((o, i) => {
        if (o.day === day && o.time === time) {
            slots[i] = { day: o.day, time: o.time };
            return true;
        }
    });
    if (!obj) {
        return next(new AppError("Interviewer Not available on the given slot", 400));
    }

    return obj

}

const filterSlotAndUpdate = async (interviewerId, day, time, next) => {
    const availability = await Availability.findOne({ interviewerId })
    if (!availability || !availability.slots) {
        return next(new AppError("Interviewer Not Found", 400));

    }
    const slots = availability.slots;

    const filteredSlots = filterSlots(slots, day, time)
    const data = await Availability.findByIdAndUpdate(availability._id, {
        slots: filteredSlots,
    }, {
        new: true,
        runValidators: true,
    });
    return data;
}

module.exports = { filterSlots, checkInterviewerAvailability, filterSlotAndUpdate }