const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            unique: true,
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        gender: { type: String, required: true },
        age: { type: Number, required: true },
        address: { type: String, required: true },
        bloodGroup: { type: String, required: true },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },


        height: String,
        weight: String,
        medicalHistory: String,
        allergies: String,
        emergencyContact: { type: String, required: true },
        image: String,
        medicalHistoryFile: String,
    },

    
    { timestamps: true }
);

// ✅ safe export
module.exports =
    mongoose.models.patients ||
    mongoose.model("patients", patientSchema);
