const router = require("express").Router();
const interviewerController = require("../controllers/interviewerController");

router.post("/interviewer/signup", interviewerController.SignUp);
router.post("/interviewer/login", interviewerController.Login);

router
  .route("/interviewer")
  .get(interviewerController.getAllUsers)

router
  .route("/interviewer/:id")
  .patch(interviewerController.updateMe);

module.exports = router;
