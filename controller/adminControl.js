const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");
const patientModel = require("../models/patientModel");

// ================= CHANGE DOCTOR ACCOUNT STATUS =================
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;

        const doctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { status },
            { new: true }
        );

        const user = await userModel.findById(doctor.userId);
        const notification = user.notification;

        if (status === "released") {
            notification.push({
                type: "doctor-account-released",
                message: `${doctor.firstName} ${doctor.lastName} - Doctor has been released by admin`,
                onClickPath: "/notification",
            });
            user.isDoctor = false;
        } else if (status === "approved") {
            notification.push({
                type: "doctor-account-reinstated",
                message: `${doctor.firstName} ${doctor.lastName} - Doctor has been renewed by the admin`,
                onClickPath: "/notification",
            });
            user.isDoctor = true;
        }

        await user.save();

        res.status(201).send({
            success: true,
            message: "Account Status Updated",
            data: doctor,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error During Account Change Status",
        });
    }
};

// ================= CHANGE PATIENT STATUS =================
const changePatientStatusController = async (req, res) => {
    try {
        const { patientId, status } = req.body;

        const patient = await patientModel.findByIdAndUpdate(
            patientId,
            { status },
            { new: true }
        );

        const user = await userModel.findById(patient.userId);

        if (status === "approved") {
            user.isPatient = true;
        } else if (status === "rejected") {
            user.isPatient = false;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Patient status updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update patient status",
        });
    }
};



// ================= BLOCK / UNBLOCK USER =================
const blockUserController = async (req, res) => {
    try {
        const { userId, status } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot block admin users",
            });
        }

        user.isBlocked = status;
        await user.save();

        res.status(200).json({
            success: true,
            message: status ? "User blocked successfully" : "User unblocked successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user status",
        });
    }
};

// ================= GET ALL USERS =================
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
        });
    }
};





// ================= GET ALL DOCTORS =================
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            data: doctors,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
        });
    }
};

// ================= GET ALL PATIENTS =================
const getAllPatientsController = async (req, res) => {
    try {
        const patients = await patientModel.find({});
        res.status(200).json({
            success: true,
            data: patients,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch patients",
        });
    }
};

// ================= DELETE PATIENT =================
const deletePatientController = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await patientModel.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        await patientModel.findByIdAndDelete(patientId);
        await userModel.findByIdAndDelete(patient.userId);

        res.status(200).json({
            success: true,
            message: "Patient account deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete patient",
        });
    }
};

// ================= DELETE DOCTOR =================
const deleteDoctorController = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        await doctorModel.findByIdAndDelete(doctorId);
        await userModel.findByIdAndDelete(doctor.userId);

        res.status(200).json({
            success: true,
            message: "Doctor account deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete doctor",
        });
    }
};

// ================= GET SINGLE PATIENT (✅ ONLY ADDITION) =================
const getSinglePatientController = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await patientModel.findById(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        res.status(200).json({
            success: true,
            data: patient,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient info",
        });
    }
};

module.exports = {
    getAllUsersController,
    getAllDoctorsController,
    getAllPatientsController,
    changeAccountStatusController,
    blockUserController,
    deletePatientController,
    deleteDoctorController,
    changePatientStatusController,
    getSinglePatientController, 
};
