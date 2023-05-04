const router = require("express").Router();
const interviewerController = require("../controllers/interviewerController");
// const authController = require("../controllers/authController");


router.post("/interviewer/signup", interviewerController.SignUp);
router.post("/interviewer/login", interviewerController.Login);


router
  .route("/interviewer")
  .get(interviewerController.getAllUsers)
//   .post(interviewerController.createUser);

router
  .route("/interviewer/:id")
  .patch(interviewerController.updateMe);
// router
//   .route("/deleteme")
//   .delete(interviewerController.deleteMe);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// router.patch(
//   "/updateMyPassword",
//   authController.ProtectTours,
//   authController.updatePassword
// );

// router
//   .route("users/:id")
//   .get(interviewerController.getUser)
//   .patch(interviewerController.updateUser)
//   .delete(interviewerController.deleteUser);
module.exports = router;
