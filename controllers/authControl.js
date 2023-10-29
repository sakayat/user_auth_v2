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

module.exports = { signUp, signIn };
