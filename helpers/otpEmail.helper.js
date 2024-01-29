const nodemailer = require('nodemailer');

module.exports = async (userEmailAddress, subject, text, userOTP, res) => {
    const emailConfig = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    };

    const transporter = nodemailer.createTransport(emailConfig);

    async function sendOTPViaEmail(userEmail, otp) {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email address
            to: userEmail,
            subject: subject,
            text: ` /${otp}/ ` + text
        };
      
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({
                    code: 400,
                    message: "Sending OTP Error !"
                })
                return;
            }
            console.log(`OTP sent: ${info.messageId}`);
        });
    }
    
    // Generate OTP and send it
    await sendOTPViaEmail(userEmailAddress, userOTP);
}