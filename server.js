require("dotenv").config()
const express = require("express");
const connectDB = require("./connectDB");
const app = express()
const port = process.env.PORT
const userRoutes = require("./routers/router")

// connect db
connectDB()

app.listen(port, () => {
    console.log(`server is listening on the ${port}`)
})

// route
app.use("/user", userRoutes)

