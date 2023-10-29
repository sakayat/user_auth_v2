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

module.exports = { signUp };
