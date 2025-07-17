const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}); 
        res.status(200).send({
            message: 'Getting User List Successfully',
            success: true, 
            data: users
         });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error For Getting User List', 
            success: false, 
            error 
        });
    }
};


const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}); 
        res.status(200).send({
            message: 'Getting Doctor List Successfully',
            success: true,
            data: doctors
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error For Getting Doctor List',
            success: false,
            error
        });
    }
};


const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;

        if (status === 'released') {
            notification.push({
                type: 'doctor-account-released',
                message: `${doctor.firstName} ${doctor.lastName} - Doctor has been released by admin`,
                onClickPath: '/notification'
            });
            user.isDoctor = false;
        } else if (status === 'approved') {
            notification.push({
                type: 'doctor-account-reinstated',
                message: `${doctor.firstName} ${doctor.lastName} - Doctor has been renew by the admin`,
                onClickPath: '/notification'
            });
            user.isDoctor = true;
        } else {
            notification.push({
                type: 'doctor-account-request-updated',
                message: `${doctor.firstName} ${doctor.lastName} - Doctor Request Has ${status}`,
                onClickPath: '/notification'
            });
            user.isDoctor = status === 'approved' ? true : false;
        }

        await user.save();
        res.status(201).send({ message: 'Account Status Updated', success: true, data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error During Account Change Status',
            success: false,
            error
        });
    }
};


const blockUserController = async (req, res) => {
    try {
        const { userId, status } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        if (user.isAdmin) {
            return res.status(403).json({ message: "Cannot block admin users", success: false });
        }

        user.isBlocked = status;
        await user.save();

        const message = status ? "User blocked successfully" : "User unblocked successfully";
        res.status(200).json({ message, success: true, data: user });

    } catch (error) {
        console.error("Error blocking/unblocking user:", error);
        res.status(500).json({ message: "Failed to update user status", success: false });
    }
};


module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController, blockUserController }