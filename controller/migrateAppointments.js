const mongoose = require("mongoose");
const appointmentModel = require("../models/appointmentModel");


mongoose.connect("mongodb://localhost:27017/Doctor_Details");

const convertIds = async () => {
    try {
        console.log("🔄 Starting UserId & DoctorId migration...");

        const appointments = await appointmentModel.find();

        for (let appointment of appointments) {
            if (typeof appointment.userId === "string") {
                appointment.userId = new mongoose.Types.ObjectId(appointment.userId);
            }

            
            if (typeof appointment.doctorId === "string") {
                appointment.doctorId = new mongoose.Types.ObjectId(appointment.doctorId);
            }

            await appointment.save();
        }

        console.log("✅ Migration completed successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        mongoose.connection.close();
    }
};

convertIds();
