const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/email");

const signUp = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7day",
    });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(404).json({ message: "something went wrong" });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json("please provide email and password");

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json("user not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json("password is invalid");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7day",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(404).json({ message: "something went wrong" });
  }
};

const protect = async (req, res, next) => {
  const userToken = req.headers.authorization;
  let token;
  if (userToken.startsWith("Bearer")) {
    token = userToken.split(" ")[1];
  }
  if (!token) return res.json("token invalid");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const user = await User.findById(decoded.id);
  if (!user) return res.status(403).json({ message: "user token not exits" });
  req.user = user;
  next();
};


const forgetPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(403).json("we could not find the user email");
  }
  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/resetPassword/${resetToken}`;
  const message = `Password reset request. Please use the link reset your password\n\n${resetUrl}\n\nThe reset token valid only for 10 minutes`
  try {
    await sendMail({
      email: user.email,
      subject: 'password change request received',
      message: message
    });
    res.status(200).json({
      status: 'success',
      message: 'password reset link send to email'
    })
  } catch (error) {
    user.passwordRestToken = undefined;
    user.passwordRestTokenExpire = undefined;
    user.save({validateBeforeSave: false})
  }
  return next()
};

const resetPassword = (req, res, next) => {};

module.exports = { signUp, signIn, protect, forgetPassword, resetPassword };

