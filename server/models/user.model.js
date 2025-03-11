const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  verifiedTojen: String,
  isVerified: {
    type: Boolean,
    default:false,
  },
  verified:Date
});

UserScheme.pre("save", async function () {
  if(!this.isModified('password')) return 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserScheme.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserScheme);
