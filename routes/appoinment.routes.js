const router = require("express").Router();
const appointmentController = require("../controllers/appoinments");

router
  .route("/appointment")
  .post(appointmentController.AddAppointment)
  .get(appointmentController.GetAppointment);

router
  .route("/appointment/:id")
  .get(appointmentController.GetAppointmentBYId)
  .patch(appointmentController.UpdateAppointment)
  .delete(appointmentController.DeleteAppointment);


router
  .route("/appointment/interviewer/:interviewerId")
  .get(appointmentController.GetAllInterviewerAppointmentBYId)

router
  .route("/appointment/interviewee/:intervieweeId")
  .get(appointmentController.GetAllIntervieweeAppointmentBYId)



module.exports = router;
