const express = require("express");
const authControl = require("../controllers/authControl");

const router = express.Router()

router.get("/", authControl)

module.exports = router;