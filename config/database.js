const mongoose = require('mongoose');

module.exports.connect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect Successful!');
    } catch (error) {
        console.log('Connect Error!');
    }
}