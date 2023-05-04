// const express = require("express");
// var favicon = require('serve-favicon');
// const path = require("path")
// const morgan = require("morgan")
// require("./models/index")
// const dotenv = require("dotenv")
// dotenv.config({path:"./config.env"})
// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errroController');
// const app = express();

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// app.use(morgan("dev"))
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))
// app.set('view engine', 'pug')
// app.set("views", path.join(__dirname, "views"));
// // app.set('views', './views')
// app.use('/static', express.static(path.join(__dirname, 'public')))
// // app.use(express.static(path.join(__dirname, 'public')))

// app.get("/getview", (req, res) => {
//     res.render("firstview")
// })

// const ToursRouter = require("./routes/tours.routes")
// app.use(ToursRouter)

// // app.route("/tours").get(async(req,res)=>{
// //     const data = await tours.find();
// //         console.log(data)
// //         res.send(data)
// // }).post(async(req,res)=>{
// //     console.log(req.body)
// //     const data = new tours(req.body)
// //     const result = await data.save();
// //     console.log(result)
// //     res.send(result)
// // })

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//   });

//   app.use(globalErrorHandler);

// module.exports = app;

const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSantize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errroController");
// const tourRouter = require("./routes/tours.routes");
// const authRouter = require("./routes/auth.routes");
// const userRouter = require("./routes/users.routes");
const interviewerRouter = require("./routes/interviewer.routes");
const intervieweeRouter = require("./routes/interviewee.routes");
const availabiltyRouter = require("./routes/availabilty.routes");

const app = express();

// 1) MIDDLEWARES
//For secure HTTP headers
app.use(helmet());

//for logging development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//for limiting api call from same IP address
const Limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests in an hour , please try after an hour",
});
app.use(`/api`, Limiter);

//for parse body
app.use(express.json({ limit: "10kb" }));

//sanitize nosql query enjector and sanitize req.body and req.params req.query
app.use(mongoSantize());

//data sanitize
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//for serving static files
app.use(express.static(`${__dirname}/public`));

//for add parameter to request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// app.use("/api/v1", tourRouter);
// app.use("/api/v1", authRouter);
// app.use("/api/v1", userRouter);
app.use("/api/v1", interviewerRouter);
app.use("/api/v1", intervieweeRouter);
app.use("/api/v1", availabiltyRouter);

//for handling undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
//global error handler
app.use(globalErrorHandler);

module.exports = app;
