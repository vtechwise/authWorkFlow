const express = require("express");
const {
  getAllProduct,
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
} = require("../controllers/product.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const { getSingleProductReview } = require("../controllers/review.controller");

const router = express.Router();

router
  .route("/")
  .get(getAllProduct)
  .post([authenticateUser, authorizePermissions("admin")], createProduct);
router.post("/upload", authorizePermissions("admin"), uploadImage);
// router.get("/:id/reviews", getSingleProductReview);
router
  .route("/:id")
  .get(getSingleProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct);

module.exports = router;
