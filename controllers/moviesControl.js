
const movies = (req,res) => {
    res.status(200).json({message: "welcome to protected routes"});
}

module.exports = {movies};