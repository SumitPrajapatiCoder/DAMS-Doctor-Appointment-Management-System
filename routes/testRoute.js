const express = require("express");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.get("/test-email", async (req, res) => {
    try {
        await sendEmail(
            "your_email@gmail.com",
            "Test Email ✔️",
            `<h2>Email service is working</h2>
       <p>If you received this, Nodemailer is configured correctly.</p>`
        );

        res.send({ success: true, message: "Test email sent successfully" });
    } catch (error) {
        res.status(500).send({ success: false, error });
    }
});

module.exports = router;
