const router = require("express").Router();
const AvailabiltyController = require("../controllers/availabilityController");

router
  .route("/availabilty")
  .post(AvailabiltyController.AddAvailability)
  .get(AvailabiltyController.GetAvailabilities);

router
  .route("/availabilty/:id")
  .get(AvailabiltyController.GetAvailabilityBYId)
  .patch(AvailabiltyController.UpdateAvailabilty)
  .delete(AvailabiltyController.DeleteAvailabilty);

module.exports = router;
