const { ApiFeatures } = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Availability = require("../models/availability")
const { filterSlots } = require("../helpers/filterSlots")

const AddAvailability = catchAsync(async (req, res, next) => {
    const { interviewerId, slots } = req.body;

    if (!interviewerId || !slots) {
        return next(new AppError("interviewerId and slots are required", 400));
    }

    const availability = await Availability.findOne({
        interviewerId: req.body.interviewerId
    })
    if (availability) {
        return next(new AppError("Availability already created please update the slots", 400));
    }
    const data = await Availability.create({ interviewerId, slots });
    res.status(201).json({
        status: "success",
        data,
    });
});

const GetAvailabilities = catchAsync(async (req, res) => {
    const features = new ApiFeatures(Availability.find().populate('interviewerId', { name: 1, email: 1 }), req.query)
        .filter()
        .pagination()
        .sort()
        .limitFields();

    const availability = await features.query; //execute the query

    res.status(201).json({
        status: "success",
        count: availability.length,
        Availability: availability,
    });
});

const GetAvailabilityBYId = catchAsync(async (req, res, next) => {
    const { interviewerId } = req.params;
    const availability = await Availability.findOne({ interviewerId }).populate('interviewerId', { name: 1, email: 1 });
    // const tour = await tours.findOne({_id:req.params.id})//same work as above
    if (!availability) {
        return next(new AppError("No availability found with that ID", 404));
    }
    res.status(201).json({
        status: "success",
        count: availability.length,
        Availability: availability,
    });
});

const UpdateAvailabilty = catchAsync(async (req, res, next) => {
    const { slots } = req.body;
    const { interviewerId } = req.params;

    if (!interviewerId || !slots || !slots[0]) {
        return next(new AppError("please enter a valid slot", 404));
    }
    const availability = await Availability.findOne({ interviewerId })
    const days = req.body.slots[0].day;
    const times = req.body.slots[0].time;
    const dbSlots = availability.slots;
    function containsObject(obj, dbSlots) {
        return dbSlots.some(elem => elem.day === days && elem.time === times)
    }
    const containsObjects = containsObject(req.body.slots[0], dbSlots);
    if (containsObjects === true) {
        return next(new AppError("This slot is already in your slot list", 404));
    }
    const availabilityId = availability._id;
    await Availability.updateOne({ id: availabilityId }, {
        $push: {
            slots: req.body.slots
        }
    });
    const data = await Availability.findOne({ interviewerId })
    res.status(200).json({
        status: "success",
        data,
    });
});

const DeleteAvailabilty = catchAsync(async (req, res, next) => {
    const { interviewerId } = req.params;
    const availability = await Availability.findOne({ interviewerId })

    const data = await Availability.findByIdAndDelete(availability._id);
    if (!data) {
        return next(new AppError("No availability found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: null,
    });
});

const DeleteSlot = catchAsync(async (req, res, next) => {
    const { interviewerId } = req.params;
    const { day, time } = req.body;

    if (!interviewerId || !day || !time) {
        return next(new AppError("interviewerId and day and time are required", 400));
    }
    const availability = await Availability.findOne({ interviewerId })

    const dbSlots = availability.slots;

    const filteredSlots = filterSlots(dbSlots, day, time)
   
    const data = await Availability.findByIdAndUpdate(availability._id, {
        slots: filteredSlots,
    }, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data: data,
    });
});



module.exports = {
    AddAvailability,
    GetAvailabilities,
    GetAvailabilityBYId,
    UpdateAvailabilty,
    DeleteAvailabilty,
    DeleteSlot
};
