const router = require("express").Router();
const intervieweeController = require("../controllers/intervieweeCotroller");
// const authController = require("../controllers/authController");


router.post("/interviewee/signup", intervieweeController.SignUp);
router.post("/interviewee/login", intervieweeController.Login);


router
    .route("/interviewee")
    .get(intervieweeController.getAllUsers)
//   .post(intervieweeController.createUser);

router
    .route("/interviewee/:id")
    .patch(intervieweeController.updateMe);
// router
//   .route("/deleteme")
//   .delete(intervieweeController.deleteMe);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// router.patch(
//   "/updateMyPassword",
//   authController.ProtectTours,
//   authController.updatePassword
// );

// router
//   .route("users/:id")
//   .get(intervieweeController.getUser)
//   .patch(intervieweeController.updateUser)
//   .delete(intervieweeController.deleteUser);
module.exports = router;
