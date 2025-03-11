const express = require("express");
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrders,
  getCurrentUserOrders,
} = require("../controllers/order.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders);
router
  .route("/showCurrentUserOrder")
  .get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrders);

module.exports = router;
