const express = require("express");
const {
    createPaymentController,
    getReceiptController
} = require("../controller/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/pay", authMiddleware, createPaymentController);
router.get("/receipt/:transactionId", authMiddleware, getReceiptController);

module.exports = router;