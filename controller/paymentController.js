const appointmentModel = require("../models/appointmentModel");
const transactionModel = require("../models/paymentModel");

const createPaymentController = async (req, res) => {
    try {
        const { appointmentId, amount, paymentMode, bankName, transactionRef } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).send({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "approved") {
            return res.status(400).send({
                success: false,
                message: "Appointment not approved"
            });
        }

        if (appointment.isPaid) {
            return res.status(400).send({
                success: false,
                message: "Already paid"
            });
        }

        const transaction = await transactionModel.create({
            appointmentId,
            userId: appointment.userId,
            doctorId: appointment.doctorId,
            amount,
            paymentMode,
            bankName,
            transactionRef
        });

        appointment.isPaid = true;
        appointment.paymentId = transaction._id;
        await appointment.save();

        res.status(201).send({
            success: true,
            message: "Payment successful",
            data: transaction
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Payment failed"
        });
    }
};

const getReceiptController = async (req, res) => {
    try {
        const receipt = await transactionModel
            .findById(req.params.transactionId)
            .populate("userId", "name email")
            .populate("doctorId", "firstName lastName specialization")
            .populate("appointmentId", "date time");

            console.log("Receipt Data:", receipt);
        res.status(200).send({
            success: true,
            data: receipt
        });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
        console.log("Error fetching receipt:", error);
    }
};

module.exports = {
    createPaymentController,
    getReceiptController
};
