const router = require("express").Router();
const intervieweeController = require("../controllers/intervieweeCotroller");

router.post("/interviewee/signup", intervieweeController.SignUp);
router.post("/interviewee/login", intervieweeController.Login);

router
    .route("/interviewee")
    .get(intervieweeController.getAllUsers)

router
    .route("/interviewee/:id")
    .patch(intervieweeController.updateMe);

module.exports = router;
