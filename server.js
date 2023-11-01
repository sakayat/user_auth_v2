require("dotenv").config()
const express = require("express");
const connectDB = require("./connectDB");
const app = express()
const port = process.env.PORT
const authRouter = require("./routers/authRouter")
const movieRouter = require("./routers/movieRouter")
// connect db
connectDB()

app.listen(port, () => {
    console.log(`server is listening on the ${port}`)
})

// middleware
app.use(express.json())

// route
app.use("/api/user", authRouter)
app.use("/api", movieRouter)

