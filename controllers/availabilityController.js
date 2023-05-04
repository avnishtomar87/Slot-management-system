const tours = require("../models/tours");
const { ApiFeatures } = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Availability = require("../models/availability")

// const aliasTopTour = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.fields = "name,price,ratingsAverage,duration ,difficulty";
//   req.query.sort = "-ratingsAverage,price";
//   next();
// };

const AddAvailability = catchAsync(async (req, res) => {
    const data = await Availability.create(req.body);
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

    const tour = await features.query; //execute the query

    res.status(201).json({
        status: "success",
        count: tour.length,
        Availability: tour,
    });
});

const GetAvailabilityBYId = catchAsync(async (req, res) => {
    const tour = await Availability.findOne({
        interviewerId: req.params.id
    }).populate('interviewerId', { name: 1, email: 1 });
    // const tour = await tours.findOne({_id:req.params.id})//same work as above
    if (!tour) {
        return next(new AppError("No availability found with that ID", 404));
    }
    res.status(201).json({
        status: "success",
        count: tour.length,
        Availability: tour,
    });
});

const UpdateAvailabilty = catchAsync(async (req, res) => {
    const data = await Availability.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data,
    });
});

const DeleteAvailabilty = catchAsync(async (req, res, next) => {
    const data = await Availability.findByIdAndDelete(req.params.id);
    if (!data) {
        return next(new AppError("No tour found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: null,
    });
});

// const getTourStats = catchAsync(async (req, res) => {
//   const stats = await tours.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } },
//     },
//     {
//       $group: {
//         _id: { $toUpper: "$difficulty" },
//         numTours: { $sum: 1 },
//         numRatings: { $sum: "$ratingsQuantity" },
//         avgRating: { $avg: "$ratingsAverage" },
//         avgPrice: { $avg: "$price" },
//         minPrice: { $min: "$price" },
//         maxPrice: { $max: "$price" },
//       },
//     },
//     {
//       $sort: { avgPrice: 1 },
//     },
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       stats,
//     },
//   });
// });

// const getMonthlyPlan = catchAsync(async (req, res) => {
//   const year = req.params.year * 1; // 2021

//   const plan = await tours.aggregate([
//     {
//       $unwind: "$startDates",
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: "$startDates" },
//         numTourStarts: { $sum: 1 },
//         tours: { $push: "$name" },
//       },
//     },
//     {
//       $addFields: { month: "$_id" },
//     },
//     {
//       $project: {
//         _id: 0,
//       },
//     },
//     {
//       $sort: { numTourStarts: -1 },
//     },
//     {
//       $limit: 12,
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       plan,
//     },
//   });
// });

module.exports = {
    AddAvailability,
    GetAvailabilities,
    GetAvailabilityBYId,
    UpdateAvailabilty,
    DeleteAvailabilty,
};
