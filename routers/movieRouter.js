const express = require("express");
const { movies } = require("../controllers/moviesControl");
const { protect, checkPermission } = require("../controllers/authControl");

const router = express.Router();

router.get("/movies", protect,checkPermission, movies);



module.exports = router;

