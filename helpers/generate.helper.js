const otpGenerator = require('otp-generator');

module.exports.generateToken = (length) => {
    const character = "ZXCVBNMASDFGHJKLQWERTYUIOPzxcvbnmasdfghjklqwertyuiop1234567890"

    let result = "";

    for (let i = 0; i < length; i++) {
        result += character.charAt(Math.floor(Math.random() * character.length));
    }
    return result;
};

module.exports.generateOTP = (length) => {
    return otpGenerator.generate(length, { digits: true, upperCase: false, specialChars: false, alphabets: false });
}
