const User = require("../models/user.model");
const OtpPassword = require("../models/otpPassword.model");
const responseHelper = require("../../../helpers/response.helper");
const userKey = ["fullName", "email", "phone", "password", "token", "avatar", "status"];
const md5 = require("md5");
const otpEmailHelper = require("../../../helpers/otpEmail.helper");
const generateHelper = require("../../../helpers/generate.helper");

// [GET] /api/v1/user/
module.exports.list = async (req, res) => {
    try {
        const users = await User.find({ deleted: false }).select("fullName email phone avatar");
        responseHelper.success(res, "This is all users of this web", "users", users);
    } catch (error) {
        responseHelper.error(res, "Cannot find users");
    }   
}

// [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
    try {
        // Standardized email
        req.body.email = req.body.email.toLowerCase();

        // Has exist email ?
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if(existEmail) {
            responseHelper.existEmail(res);
        } else {
            // Encode Password
            req.body.password = md5(req.body.password);

            // Check Key is Right ?
            for(const key in req.body) {
                userKey.indexOf(key) ==  -1 && delete req.body[key];
            }

            // Create User
            const user = new User(req.body);

            // Save
            await user.save();

            res.cookie("token", user.token);
            
            responseHelper.registerSuccess(res);
        }
    } catch (error) {
        responseHelper.registerFail(res);
    }
}

// [POST] /api/v1/user/login
module.exports.login = async (req, res) => {
    try {
        console.log("1")
        const { email, password } = req.body;
        const existUser = await User.findOne({
            email: email,
            deleted: false
        });
        if(existUser) {
            if(existUser.password === md5(password)) {
                if(existUser.status === "inactive") {
                    res.json({
                        code: 400,
                        message: "Account Banded"
                    })
                } else {
                    res.cookie("token", existUser.token);
                    res.json({
                        code: 200,
                        message: "Login Success"
                    })
                }
            } else {
                res.json({
                    code: 400,
                    message: "Password Wrong"
                })
            }
        } else {
            res.json({
                code: 400,
                message: "Account Not Exist"
            });
        }
    } catch (error) {
        responseHelper.error(res);
    }
}

// [POST] /api/v1/user/forgot/password
module.exports.passwordForgot = async (req, res) => {
    try {
        const time_expire_otp = 2;
        const userEmail = req.body.email.toLowerCase();
        const existEmail = await User.findOne({
            email: userEmail,
            deleted: false
        });

        if(!existEmail) {
            res.json({
                code: 200,
                message: "Account Not Exist"
            });
        } else {
            const userOTP = generateHelper.generateOTP(8);
            await otpEmailHelper(
                userEmail,
                "OTP code validate forgot password !",
                "This unique and time-sensitive OTP code, which stands for One-Time Password, serves as an additional layer of security in various online processes. Employed to enhance user authentication, especially during crucial transactions or when recovering forgotten passwords, this dynamic code is generated on-demand and provides a secure and temporary means of verifying the identity of the user, ensuring a heightened level of protection for sensitive information and online activities.",
                userOTP,
                res
            );
                
            try {
                // const nowTime = new Date();
                // nowTime.setMinutes(nowTime.getMinutes() + time_expire_otp);
                const objectOtpPassword = {
                    email: userEmail,
                    otp: userOTP
                }
                const newOtpPassword = new OtpPassword(objectOtpPassword);
                await newOtpPassword.save();
            } catch (error) {
                res.json({
                    code: 400,
                    message: "Cannot save OTP password in database"
                });
                return;
            }
            res.json({
                code: 200,
                message: "Sending OTP Success !"
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Sending OTP Error !"
        })
    }
}

// [POST] /api/v1/user/otp/email
module.exports.otpEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const existOtp = await OtpPassword.findOne({
            email: email
        });

        if(!existOtp) {
            responseHelper.error(res, "Code OTP was time expired !");
            return;
        }

        if(existOtp.otp === otp) {
            const user = await User.findOne({ email: email, deleted: false });
            const enkey = generateHelper.generateToken(10);
            const keyReset = md5(md5(user.token + user.password + user.createdAt.toString()) + md5(enkey));
            res.cookie("token", user.token, { httpOnly: true });
            res.cookie("enkey", enkey, { expires: new Date(Date.now() + 60000), httpOnly: true });
            res.cookie("keyReset", keyReset, { expires: new Date(Date.now() + 60000), httpOnly: true });
            responseHelper.success(res, "Your OTP Correct !");
        } else {
            responseHelper.error(res, "Your OTP Incorrect !");
        }
    } catch (error) {
        responseHelper.error(res, "Cannot solve checking OTP !");
    }
}

// [POST] /api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const token = req.locals.token;
        const user = await User.findOne(  { token: token, email: email } );
        if(user) {
            user.password = md5(newPassword);
            await user.save();
            responseHelper.success(res, "Change password success !");
        } else {
            responseHelper.error(res, "User not exist !");
        }
    } catch (error) {
        responseHelper.error(res, "Change password fail !");
    }
}

// [GET] /api/v1/user/myAccount
module.exports.myAccount = async (req, res) => {
    try {
        const token = req.locals.token;
        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password -token -status -deleted -createdAt");
        responseHelper.success(res, "Success", "myAccount", user);
    } catch (error) {
        responseHelper.error(res);
    }
}

// [GET] /api/v1/user/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({
            _id: id,
            deleted: false
        }).select("-password -token -status -deleted -createdAt");
        responseHelper.success(res, "Success", "user", user);
    } catch (error) {
        responseHelper.error(res);
    }
}