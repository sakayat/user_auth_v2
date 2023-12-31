const express = require("express");
const { signUp, signIn, forgetPassword, resetPassword } = require("../controllers/authControl");

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/forgetPassword", forgetPassword);

router.patch("/resetPassword/:token", resetPassword);

module.exports = router;
