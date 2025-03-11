const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Product = require("../models/product.model");
const Review = require("../models/review.model");
const { checkPermission } = require("../utils");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new NotFoundError(`No review with this id ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.user = req.user.userId;
  const isProductValid = await Product.findOne({ _id: productId });
  if (!isProductValid) {
    throw new NotFoundError(`No product with the given id ${productId}`);
  }
  const reviewAlreadyexist = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (reviewAlreadyexist) {
    throw new BadRequestError("You have already reviewed this product");
  }
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params 
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({reviews})
}
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const {title, comment,rating} = req.body
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(`No review with this id ${reviewId}`)
  }
  checkPermission(req.user, review.user)
  review.title = title 
  review.comment = comment 
  review.rating = rating   
  await review.save()
  res.status(StatusCodes.OK).json({review})

};


const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  console.log(review);
  
  if (!review) {
    throw new NotFoundError(`No review with this id ${reviewId}`);
  }

  checkPermission(req.user, review.user);
  await review.deleteOne()
  res.status(StatusCodes.OK).json({ message: "Review deleted" });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
  getSingleProductReview
};
