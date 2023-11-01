const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter confirm password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password and Confirm Password does not match",
    },
  },
  passwordRestToken: String,
  passwordRestTokenExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.createResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(32, toString("hex"));
  this.passwordRestToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordRestTokenExpire = Date.now() * 10 * 60 * 1000;
  console.log(resetToken, this.passwordRestToken)
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
