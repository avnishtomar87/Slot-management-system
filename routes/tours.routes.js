// const router = require("express").Router();
// const ToursController = require("../controllers/tours.controller");
// const authController = require("../controllers/authController");

// router
//   .route("/top-5-tours")
//   .get(ToursController.aliasTopTour, ToursController.GetTours);

// router.route("/tours-statics").get(ToursController.getTourStats);

// router.route("/monthly-plan/:year").get(ToursController.getMonthlyPlan);

// router
//   .route("/tours")
//   .post(ToursController.AddTours)
//   .get(authController.ProtectTours, ToursController.GetTours);

// router
//   .route("/tours/:id")
//   .get(ToursController.GetToursBYId)
//   .patch(ToursController.UpdateTours)
//   .delete(authController.ProtectTours, authController.restrictTo('admin', 'lead-guide'),ToursController.DeleteTours);

// module.exports = router;
