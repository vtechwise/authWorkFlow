const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  verifyEm
} = require("../controllers/users.controller");
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route("/showMe").get();
router.patch("/updateUser",authenticateUser, updateUser);
router.patch("/updatePassword",authenticateUser, updateUserPassword);
router.route("/:id").get(getSingleUser).delete(deleteUser);

module.exports = router;
