const express = require("express");
const { movies } = require("../controllers/moviesControl");
const { protect } = require("../controllers/authControl");

const router = express.Router();

router.get("/movies", protect, movies);


module.exports = router;

