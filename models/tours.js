// const mongoose = require('mongoose');
// const slugify = require('slugify') ;
// const validator = require("validator") 

// const TourSchema= new mongoose.Schema({
// name:{
//     type:String,
//    required:[true,"A tour must have a name"],
//    unique:true,
//    trim:true,
//    maxlength:[40,"your name must not have more than 40 charaters"],
//    minlength:[2,"your name must have a character"],
// //    validate:[validator.isAlpha,"tours name must only contains characters"]
// },
// slug:String,
// duration:{
//     type:Number,
//    required:[true,"A tour must have a duration"]
// },
// maxGroupSize:{
//     type:Number,
//    required:[true,"A tour must have a MaxGroupSize"]
// },
// difficulty:{
//     type:String,
//    required:[true,"A tour must have a difficulty"],
//    enum:{
//        values:["EASY","HARD","AVERAGE","VERY HARD"],
//        message:"difficulty is either easy, hard, average, very hard"
//    }
// },
// ratingsAverage:{
//     type:Number,
//   default:4.5,
//   min:[1,'A rating must not less than 1'],
//   max:[5,"A rating must not more than 5.0"]
// },
// ratingsQuantity:{
//     type:Number,
//   default:0
// },
// price:{
//     type:Number,
//    required:[true,"A tour must have a price"]
// },
// priceDiscount:{
//     type:Number,
//     validate:{
//     validator:function(val){
//         //this keyword only points to current doc only on new document creation will not work while update
//       return val<this.price
//     },
//     message:"Discount price ({val}) is lower than regular price"
//     }
// },
// summary:{
//     type:String,
//     trim:true
// },
// description:{
// type:String,
// required:[true,"A tour must have a description"]
// },
// imageCover:{
// type:String,
// required:[true,"A tour must have a image cover"]
// },
// images:[String],
// createdAT:{
//     type:Date,
//     default:Date.now(),
//     select:false
// },
// startDates:[Date],
// secretTour:{
//     type:Boolean,
//     default:false
// }
// },{
//     toJSON:{virtuals:true},
//     toObject:{virtuals:true}
// });

// //MONGODB's DOCUMENT MIDDLEWARE RUN BEFORE .CREATE() .SAVE() BUT NOT RUN BEFORE INSERTMANY , update
// TourSchema.pre("save",function(next){
//     this.slug = slugify(this.name,{lower:true})
//     next();
// })

// // TourSchema.pre("save",function(next){
// //     console.log("document will save...")
// //     next();
// // })

// // TourSchema.post("save",function(doc,next){
// // console.log(doc)
// // next();
// // })

// // QUERY MIDDLEWARE
// // TourSchema.pre(/^find/,function(next){
// TourSchema.pre(/^find/,function(next){
//     this.find({secretTour:{$ne:true}})
//     this.start = Date.now();
//     next();
// })
// // TourSchema.pre("findOne",function(next){
// //     this.find({secretTour:{$ne:true}})
// //     next();
// // })
// TourSchema.post(/^find/,function(docs,next){
//     console.log(`query takes ${Date.now()- this.start} miliseconds`)
//     // console.log(docs)
//     next();
// })

// //AGGREGRATION MIDDLEWARE
// TourSchema.pre("aggregate",function(next){
//  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
//     console.log(this.pipeline())
//     next();
// })


// //Virtual Fields in the document
// TourSchema.virtual("durationWeeks").get(function(){
//     return this.duration/7;
// })

// module.exports=mongoose.model("tours",TourSchema);