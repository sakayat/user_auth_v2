const User = require("../models/userModels");

const signUp = async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
};

module.exports = { signUp };
