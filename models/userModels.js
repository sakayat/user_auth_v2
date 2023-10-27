const { default: mongoose } = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email" ] 
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please enter confirm password"],
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
