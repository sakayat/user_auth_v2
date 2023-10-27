const express = require("express");
const userControl = require("../controllers/userControl");

const router = express.Router()

router.get("/", userControl)

module.exports = router;