const responseHelper = require("../../../helpers/response.helper");
const User = require("../models/user.model");
const md5 = require("md5");
module.exports.hasTokenAuth = async (req, res, next) => {
    const header = req.headers.authorization;
    if(header && header.startsWith('Bearer ')) {
        const token = header.split(' ')[1];
        const existUser = await User.findOne({
            token: token,
            deleted: false
        })
        if(existUser) {
            req.locals = {
                token: token,
                user: existUser
            };
            next();
        } else {
            responseHelper.error(res, "User with this token not exist");
        }
    } else {
        responseHelper.error(res, "Not transmit TOKEN therefore cannot get data");
    }
}

module.exports.hasSubmitOTP = async (req, res, next) => {
    const token = req.locals.token;
    const user = await User.findOne({
        token: token,
        deleted: false
    })
    const enkey = req.cookies.enkey;
    if(user && enkey) {
        const keyReset = md5(md5(user.token + user.password + user.createdAt.toString()) + md5(enkey));
        if (keyReset === req.cookies.keyReset) {
            next();
        } else {
            responseHelper.error(res, "You not permission to change password !");
        }
    } else {
        responseHelper.error(res, "User not exist or enkey cookie hasnt");
    }
}