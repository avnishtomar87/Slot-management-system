const { ApiFeatures } = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Appointment = require("../models/appointments");
// const Availability = require("../models/availability")
const mongoose = require('mongoose')
const { checkInterviewerAvailability, filterSlotAndUpdate } = require("../helpers/filterSlots")

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

    const appointment = await features.query;

    if (appointment) {
        let obj = appointment.find((o) => {
            return o.interviewerId._id.toString() === mongoose.Types.ObjectId(req.body.interviewerId).toString()
        });

        let objInterviewee = appointment.find((o) => {
            return o.intervieweeId._id.toString() === mongoose.Types.ObjectId(req.body.intervieweeId).toString()
        });

        if (obj && obj.day === day && obj.time === time) {
            return next(new AppError("There is Already schedule interview for interviewer", 404));
        }

        if (objInterviewee && objInterviewee.day === day && objInterviewee.time === time) {
            return next(new AppError("There is Already schedule interview for interviewee", 404));
        }

    }
    const obj = await checkInterviewerAvailability(interviewerId, day, time, next)
    if (!obj) {
        return next(new AppError("Interviewer Not available on the given slots", 400));
    }

    const data = await Appointment.create(req.body);
    if (!data) {
        return next(new AppError("Internal Server Error", 400));
    }
    await filterSlotAndUpdate(interviewerId, day, time, next)

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


const GetAllIntervieweeAppointmentBYId = catchAsync(async (req, res, next) => {
    const { intervieweeId } = req.params;
    if (!intervieweeId) {
        return next(new AppError("intervieweeId is required field", 404));
    }
    const appointment = await Appointment.find({ intervieweeId }).populate('interviewerId', { name: 1, email: 1 }).populate('intervieweeId', { name: 1, email: 1 });

    if (!appointment) {
        return next(new AppError("No Appointment found with that ID", 404));
    }
    res.status(201).json({
        status: "success",
        count: appointment.length,
        Appointment: appointment,
    });
});

const GetAllInterviewerAppointmentBYId = catchAsync(async (req, res, next) => {
    const { interviewerId } = req.params;
    if (!interviewerId) {
        return next(new AppError("intervieweeId is required field", 404));
    }
    const appointment = await Appointment.find({ interviewerId }).populate('interviewerId', { name: 1, email: 1 }).populate('intervieweeId', { name: 1, email: 1 });

    if (!appointment) {
        return next(new AppError("No Appointment found with that ID", 404));
    }
    res.status(201).json({
        status: "success",
        count: appointment.length,
        Appointment: appointment,
    });
});

module.exports = {
    AddAppointment,
    GetAppointment,
    GetAppointmentBYId,
    UpdateAppointment,
    DeleteAppointment,
    GetAllIntervieweeAppointmentBYId,
    GetAllInterviewerAppointmentBYId
};
