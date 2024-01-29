const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/user.controller");

router.get(
    "/list",
    auth.hasTokenAuth,
    controller.list
)

router.post(
    "/register",
    controller.register
)

router.post(
    "/login",
    controller.login
)

router.post(
    "/password/forgot",
    controller.passwordForgot
)

router.post(
    "/otp/email",
    controller.otpEmail
)

router.post(
    "/password/reset",
    auth.hasTokenAuth,
    auth.hasSubmitOTP,
    controller.resetPassword
)

router.get(
    "/detail/:id",
    auth.hasTokenAuth,
    controller.detail
)

router.get(
    "/myAccount",
    auth.hasTokenAuth,
    controller.myAccount
)

module.exports = router;