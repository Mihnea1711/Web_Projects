const express = require("express");

const wrapAsync = require("../utils/wrapAsync");
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;
