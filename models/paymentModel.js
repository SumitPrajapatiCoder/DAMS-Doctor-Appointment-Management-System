const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["online", "offline"],
        required: true
    },
    bankName: String,
    transactionRef: String,

    status: {
        type: String,
        default: "success"
    }

}, { timestamps: true });

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = transactionModel;