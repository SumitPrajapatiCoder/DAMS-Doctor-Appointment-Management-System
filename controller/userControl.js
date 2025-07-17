const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
bcrypt.setRandomFallback(require('crypto').randomBytes);
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel')
const dayjs = require('dayjs')

// Register Controller
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist_user = await userModel.findOne({ email: email });
        if (exist_user) {
            return res.status(400).send({ message: 'User Already Exists', success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_pass = await bcrypt.hash(password, salt);
        req.body.password = hashed_pass;

        const new_user = new userModel(req.body);
        await new_user.save();

        res.status(201).send({ message: 'Registration Successful', success: true });
    } catch (error) {
        console.log('Error From Use Control = ', error);
        res.status(500).send({ success: false, message: `Register Controller: ${error.message}` });
    }
};


//Login Controller
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'User Not Found', success: false })
        }
        const pass_match = await bcrypt.compare(req.body.password, user.password)
        if (!pass_match) {
            return res.status(200).send({ message: 'Invalid Email Or Password', success: false })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({ message: 'Login Done SuccessFully', success: true, token })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error In Login Control ${error.message}` })
    }
};

const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: 'User Not Found', success: false })
        }
        else {
            res.status(200).send({ success: true, data: user })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Auth Error', success: false, error })
    }
};



const applyDoctorController = async (req, res) => {
    try {
        const newDoctor = await doctorModel({
            ...req.body,
            status: "pending",
            image: req.body.image,
        });
        await newDoctor.save()
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({ message: 'Doctor Account Applied Successfully', success: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error while Applying For Doctor', success: false, error })
    }
}


const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "public/uploads/";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage: imageStorage });

const uploadPhotoController = async (req, res) => {
    try {
        const imagePath = `/uploads/${req.file.filename}`;
        res.status(200).json({ success: true, path: imagePath });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed", error });
    }
};

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updatedUser = await user.save()
        res.status(200).send({ message: 'All Notification Mark As Read', success: true, data: updatedUser })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error In Notification', success: false, error })
    }
}

const deleteAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = []
        user.seenNotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({ message: 'Notification Delete Successfully', success: true, data: updatedUser })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error In Delete Notification', success: false, error })
    }
}


const getAllDoctorListController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: 'approved' })
        res.status(200).send({ message: 'Fetching Doctor List Successfully', success: true, data: doctors })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error during Getting Doctor List', success: false, error })
    }
}


const getBookedSlotsController = async (req, res) => {
    try {
        const { doctorId, date } = req.body;

        if (!doctorId || !date) {
            return res.status(400).send({ success: false, message: "Doctor ID and date are required" });
        }

        const appointments = await appointmentModel.find({ doctorId, date });

        const bookedSlots = appointments.map((appointment) => ({
            time: appointment.time,
            status: appointment.status
        }));

        res.status(200).send({ success: true, data: bookedSlots });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching booked slots', success: false, error });
    }
};


const bookAppointmentController = async (req, res) => {
    try {
        req.body.status = 'pending';
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.notification.push({
            type: 'New-Appointment-Request',
            message: `A New Appointment Request From ${req.body.userInfo.name}`,
            onClickPath: '/user/appointment',
        });
        await user.save();

        res.status(200).send({ message: 'Appointment Booked Successfully', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error In Booking Appointment', success: false, error });
    }
};


const getBookedSlotsWithStatusController = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const appointments = await appointmentModel.find({ doctorId, date });

        const slotsWithStatus = appointments.map((appointment) => ({
            time: appointment.time,
            status: appointment.status
        }));

        res.status(200).send({ success: true, data: slotsWithStatus });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching slots with status', success: false, error });
    }
};


const userAppointmentController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.body.userId })
            .populate('doctorId', 'firstName lastName phone specialization feesPerConsultation')
            .sort({ date: 1 });
        res.status(200).send({ message: 'Getting Appointment List To User SuccessFully', success: true, data: appointments })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error User Appointment List', success: false, error })
    }
}


const setRoleController = async (req, res) => {
    const { role } = req.body;

    try {
        const user = await userModel.findOne({ _id: req.user.id });

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        user.hasRoleStatus = role;

        await user.save();

        res.status(200).send({ success: true, message: 'Role updated successfully', user });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};




module.exports = {
    loginController, registerController, authController, applyDoctorController, getAllNotificationController,
    deleteAllNotificationController, getAllDoctorListController, bookAppointmentController, getBookedSlotsController, userAppointmentController,
    getBookedSlotsWithStatusController, setRoleController,upload,uploadPhotoController
};
