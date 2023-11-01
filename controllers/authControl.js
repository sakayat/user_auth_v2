const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

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
  if(!user) return res.status(403).json({message: "user token not exits"})
  req.user = user;
  next();
};

const checkPermission = async (req,res,next) => {
  if(req.user.role !== "admin") return res.status(403).json({message: "you are not permission on the route"})
  next();
}

const forgetPassword = async (req,res,next) => {
  const user = await User.findOne({email: req.body.email})
  if (!user) {
    return res.status(403).json("we could not find the user email");
  }
  const resetToken = user.createResetPasswordToken()
  await user.save({validateBeforeSave: false})
}

const resetPassword = (req,res,next) => {

}

module.exports = { signUp, signIn, protect, forgetPassword,resetPassword};





