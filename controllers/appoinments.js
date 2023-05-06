const { ApiFeatures } = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Appointment = require("../models/appointments");
const Availability = require("../models/availability")
const mongoose = require('mongoose')
const { filterSlots } = require("../helpers/filterSlots")

const AddAppointment = catchAsync(async (req, res, next) => {
    const { intervieweeId, interviewerId, day, time } = req.body;

    if (!intervieweeId || !interviewerId || !day || !time) {
        return next(new AppError("interviewerId and intervieweeId and day and time are required", 400));
    }

    const features = new ApiFeatures(Appointment.find().populate('intervieweeId', { name: 1, email: 1 }).populate('interviewerId', { name: 1, email: 1 }), req.query)
        .filter()
        .pagination()
        .sort()
        .limitFields();

    const appointment = await features.query; //execute the query

    if (appointment) {
        let obj = appointment.find((o) => {
            return o.interviewerId._id.toString() === mongoose.Types.ObjectId(req.body.interviewerId).toString()
        });

        let objInterviewee = appointment.find((o) => {
            return o.intervieweeId._id.toString() === mongoose.Types.ObjectId(req.body.intervieweeId).toString()
        });

        if (obj && obj.day === day && obj.time === time) {
            return next(new AppError("There is Already schedule interviewer", 404));
        }

        if (objInterviewee && objInterviewee.day === day && objInterviewee.time === time) {
            return next(new AppError("There is Already schedule interview for interviewee", 404));
        }

    }

    const data = await Appointment.create(req.body);
    if (data) {
        const availability = await Availability.findOne({ interviewerId })
        const slots = availability.slots;

        const filteredSlots = filterSlots(slots, day, time)
        await Availability.findByIdAndUpdate(availability._id, {
            slots: filteredSlots,
        }, {
            new: true,
            runValidators: true,
        });
    }
    res.status(201).json({
        status: "success",
        data,
    });
});

const GetAppointment = catchAsync(async (req, res) => {
    const features = new ApiFeatures(Appointment.find().populate('intervieweeId', { name: 1, email: 1 }).populate('interviewerId', { name: 1, email: 1 }), req.query)
        .filter()
        .pagination()
        .sort()
        .limitFields();

    const appointment = await features.query; //execute the query

    res.status(201).json({
        status: "success",
        count: appointment.length,
        Appointment: appointment,
    });
});

const GetAppointmentBYId = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findOne({
        _id: req.params.id
    }).populate('interviewerId', { name: 1, email: 1 }).populate('intervieweeId', { name: 1, email: 1 });
    // const tour = await tours.findOne({_id:req.params.id})//same work as above
    if (!appointment) {
        return next(new AppError("No Appointment found with that ID", 404));
    }
    res.status(201).json({
        status: "success",
        count: appointment.length,
        Appointment: appointment,
    });
});

const UpdateAppointment = catchAsync(async (req, res) => {
    const appointment = await Appointment.findOne({
        _id: req.params.id
    })

    const data = await Appointment.findByIdAndUpdate(appointment._id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data,
    });
});

const DeleteAppointment = catchAsync(async (req, res, next) => {
    const appointment = await Appointment.findOne({
        _id: req.params.id
    })

    const data = await Appointment.findByIdAndDelete(appointment._id);
    if (!data) {
        return next(new AppError("No Appointment found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: null,
    });
});


module.exports = {
    AddAppointment,
    GetAppointment,
    GetAppointmentBYId,
    UpdateAppointment,
    DeleteAppointment,
};
