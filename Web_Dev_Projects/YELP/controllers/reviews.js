const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  const { campgroundId } = req.params;
  const campground = await Campground.findById(campgroundId);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully created a new review!");
  res.redirect(`/campgrounds/${campgroundId}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { campgroundId, reviewId } = req.params;
  //this will pull out the reviewId from the reviews array inside the campground we are deleting from
  await Campground.findByIdAndUpdate(campgroundId, {
    $pull: { reviews: reviewId },
  });
  const result = await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/campgrounds/${campgroundId}`);
};
