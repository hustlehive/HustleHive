// const nodemailer = require("nodemailer");

// const sendEmail = async (email, subject, text) => {

//     try {

//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false,
//             family: 4, // you said you tried this — make sure it's actually being passed to the underlying socket
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         transporter.verify((err, success) => {
//             if (err) {
//                 console.error(err);
//             } else {
//                 console.log("SMTP Ready");
//             }
//         });


//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: subject,
//             text: text
//         };


//         await transporter.sendMail(mailOptions);

//         console.log(`Email sent to ${email}`);

//     } catch (error) {

//         console.log("Email sending failed");
//         console.log(error.message);

//         throw new Error("Failed to send email");
//     }
// };

// module.exports = sendEmail;


const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (email, subject, text) => {
    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "HustleHive",
                email: "hustleehivee@gmail.com",
            },
            to: [
                {
                    email,
                },
            ],
            subject,
            textContent: text,
        });

        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to send email");
    }
};

module.exports = sendEmail;