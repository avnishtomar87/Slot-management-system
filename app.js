const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSantize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errroController");
const interviewerRouter = require("./routes/interviewer.routes");
const intervieweeRouter = require("./routes/interviewee.routes");
const availabiltyRouter = require("./routes/availabilty.routes");
const appointmentRouter = require("./routes/appoinment.routes");

const app = express();

// 1) MIDDLEWARES
//For secure HTTP headers
app.use(helmet());


//for logging development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//for parse body
app.use(express.json({ limit: "10kb" }));

//sanitize nosql query enjector and sanitize req.body and req.params req.query
app.use(mongoSantize());

//data sanitize
app.use(xss());

//for serving static files
app.use(express.static(`${__dirname}/public`));

//for add parameter to request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1", interviewerRouter);
app.use("/api/v1", intervieweeRouter);
app.use("/api/v1", availabiltyRouter);
app.use("/api/v1", appointmentRouter);


//for handling undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
//global error handler
app.use(globalErrorHandler);

module.exports = app;
