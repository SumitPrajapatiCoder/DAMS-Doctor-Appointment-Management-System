const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    try {
        console.log("📧 Email process started");
        console.log("➡️ To:", to);
        console.log("➡️ Subject:", subject);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log("✅ Transporter created");

        await transporter.sendMail({
            from: `"Doctor Appointment System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("🎉 Email sent successfully!");
    } catch (error) {
        console.log("❌ Email sending failed");
        console.log(error);
    }
};

module.exports = sendEmail;
