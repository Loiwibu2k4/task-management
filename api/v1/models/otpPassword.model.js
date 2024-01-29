const mongoose = require('mongoose');

const otpPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expires: {
            type: Date,
            expires: 60
        }
    },
    { timestamps: true }
);
const OtpPassword = mongoose.model("OtpPassword", otpPasswordSchema, "otpPassword");

module.exports = OtpPassword;