const router = require("express").Router();
const AvailabiltyController = require("../controllers/availabilityController");

router
  .route("/availabilty")
  .post(AvailabiltyController.AddAvailability)
  .get(AvailabiltyController.GetAvailabilities);

router
  .route("/availabilty/:interviewerId")
  .get(AvailabiltyController.GetAvailabilityBYId)
  .patch(AvailabiltyController.UpdateAvailabilty)
  .delete(AvailabiltyController.DeleteAvailabilty);

  
router
.route("/availabilty/deleteSlot/:interviewerId")
.delete(AvailabiltyController.DeleteSlot);



module.exports = router;
