// const tours = require("../models/tours");
// const { ApiFeatures } = require("../utils/apiFeatures");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");

// const aliasTopTour = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.fields = "name,price,ratingsAverage,duration ,difficulty";
//   req.query.sort = "-ratingsAverage,price";
//   next();
// };

// const AddTours = catchAsync(async (req, res) => {
//   const data = await tours.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       data,
//     },
//   });
// });

// const GetTours = catchAsync(async (req, res) => {
//   const features = new ApiFeatures(tours.find(), req.query)
//     .filter()
//     .pagination()
//     .sort()
//     .limitFields();

//   const tour = await features.query; //execute the query

//   res.status(201).json({
//     status: "success",
//     count: tour.length,
//     data: {
//       tour: tour,
//     },
//   });
// });

// //  const GetTours = async(req,res)=>{
// //      try{ //(1A)filtering
// //          const QueryObj = {...req.query}
// //          const excludedFields = ['page','sort','limit','fields']//want ot exclude these fields from req.query obj
// //             excludedFields.forEach(el=>delete QueryObj[el]);//excluded some propery form req.query obj

// // //(2B)Advance filtering
// //    let queryStr = JSON.stringify(QueryObj)
// //    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
// // //    console.log(JSON.parse(queryStr));

// //    let query = tours.find(JSON.parse(queryStr));//build the query

// //    ////(3) sorting
// //    if(req.query.sort){
// //        const sortBy = req.query.sort.split(",").join(" ")
// //     //    console.log(sortBy)
// //      query = query.sort(sortBy)
// //    }else{
// //        query = query.sort(`-createdAt`)
// //    }
// //    ///(4)limiting the fields
// //    if(req.query.fields){
// //        const fields = req.query.fields.split(',').join(" ");
// //        query = query.select(fields)
// //    }
// //    else{
// //        query = query.select(`-__v`)
// //    }

// //    ///(4)pagination
// //    const page = req.query.page*1 || 1;
// //    const limit = req.query.limit*1 || 10;
// //    const skip  = (page-1)*limit

// //    query = query.skip(skip).limit(limit)

// //    if(req.query.page){
// //        const newTours = await tours.countDocuments();
// //        if(skip >= newTours){
// //            throw new Error("this page does not exists")
// //        }
// //    }

// //         //  const query =  tours.find({
// //         //      duration:req.query.duration,
// //         //      difficulty:req.query.difficulty
// //         //     });

// //             // const query = tours.find()//build the query
// //             // .where("duration")
// //             // .equals(req.query.duration)
// //             // .where("difficulty")
// //             // .equals(req.query.difficulty)

// //             const tour = await query;//execute the query
// //             //query.sort().select().skip().limit()

// //         res.status(201).json({
// //             status:"success",
// //             count:tour.length,
// //             data:{
// //              tour:tour
// //             }
// //         })
// //     } catch(err){
// //         console.log(err)
// //       res.status(400).json({
// //        status:"fail",
// //        message:err
// //    })
// //     }
// //  }

// const GetToursBYId = catchAsync(async (req, res) => {
//   const tour = await tours.findById(req.params.id);
//   // const tour = await tours.findOne({_id:req.params.id})//same work as above
//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }
//   res.status(201).json({
//     status: "success",
//     count: tour.length,
//     data: {
//       tour: tour,
//     },
//   });
// });

// const UpdateTours = catchAsync(async (req, res) => {
//   const data = await tours.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     status: "success",
//     data: {
//       data,
//     },
//   });
// });

// const DeleteTours = catchAsync(async (req, res, next) => {
//   const data = await tours.findByIdAndDelete(req.params.id);
//   if (!data) {
//     return next(new AppError("No tour found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       data: null,
//     },
//   });
// });

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

// module.exports = {
//   AddTours,
//   GetTours,
//   GetToursBYId,
//   UpdateTours,
//   DeleteTours,
//   aliasTopTour,
//   getTourStats,
//   getMonthlyPlan,
// };
