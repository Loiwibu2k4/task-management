const mongoose = require('mongoose');
const generate = require('../../../helpers/generate.helper');

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: generate.generateToken(30),
            unique: true
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active"
        },
        deletedAt: Date,
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema, "user");

module.exports = User;