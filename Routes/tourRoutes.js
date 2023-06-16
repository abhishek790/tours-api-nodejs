const express = require('express');
const router = express.Router();

const tourController = require('./../controllers/tourController');
/*
// param middleware is a middleware that only runs for certain parameters so in our case the /:id ,we can write middleware that only runs when :id is present in the url

// here inside param we actually specify the parameter that we actually want to search for,so paramter for which this middleware is gonna run
// in param middleware function we actually get access to 4th argument i.e value of the parameter in question
router.param('id', (req, res, next, val) => {
  console.log(`Tour id is:${val}`);
  next();
});
*/
router.param('id', tourController.checkID);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTours);
router
  .route('/:id')
  .get(tourController.getTours)
  .patch(tourController.updateTours)
  .delete(tourController.deleteTours);

module.exports = router;
