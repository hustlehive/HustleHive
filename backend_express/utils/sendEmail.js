const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            family: 4,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        };


        await transporter.sendMail(mailOptions);

        console.log(`Email sent to ${email}`);

    } catch (error) {

        console.log("Email sending failed");
        console.log(error.message);

        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;