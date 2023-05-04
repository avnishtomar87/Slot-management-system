const mongoose = require("mongoose");
const dotenv = require("dotenv");

// example of uncaughtException is --> console.log(x)
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect("mongodb://0.0.0.0:27017/natours", {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3002;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// example of unhandledRejection i.e. some error in db connection may be wrong credentials
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
