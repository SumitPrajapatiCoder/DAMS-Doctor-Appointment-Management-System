const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
bcrypt.setRandomFallback(require('crypto').randomBytes);
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const patientModel = require('../models/PatientModel');


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


// Apply Doctor Controller
const applyDoctorController = async (req, res) => {
    try {
        if (!req.body.degreeCertificate) {
            return res.status(400).json({
                success: false,
                message: "Degree certificate is required",
            });
        }

        const newDoctor = new doctorModel({
            ...req.body,
            status: "pending",
            image: req.body.image,
            degreeCertificate: req.body.degreeCertificate,
        });

        await newDoctor.save();

        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;

        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: `${newDoctor.firstName} ${newDoctor.lastName}`,
                onClickPath: '/admin/doctors',
            },
        });

        await userModel.findByIdAndUpdate(adminUser._id, { notification });

        res.status(201).send({
            success: true,
            message: 'Doctor Account Applied Successfully',
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while Applying For Doctor',
            error,
        });
    }
};




const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===== CERTIFICATE STORAGE =====

const certificateStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "public/uploads/certificates";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadCertificate = multer({ storage: certificateStorage });

// ===== CERTIFICATE UPLOAD CONTROLLER =====
const uploadCertificateController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No certificate uploaded",
            });
        }

        res.status(200).json({
            success: true,
            path: `/uploads/certificates/${req.file.filename}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Certificate upload failed",
        });
    }
};


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


// Multer upload configuration
const upload = multer({ storage: imageStorage });

const uploadPhotoController = async (req, res) => {
    try {
        const imagePath = `/uploads/${req.file.filename}`;
        res.status(200).json({ success: true, path: imagePath });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed", error });
    }
};


//upload medical documents controller


const medicalStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "public/uploads/medical";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadMedical = multer({ storage: medicalStorage });

const uploadMedicalFileController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: "No file uploaded" });
        }

        res.status(200).send({
            success: true,
            path: `/uploads${req.file.filename}`,
        });
    } catch (error) {
        res.status(500).send({ success: false });
    }
};

//apply patient Controller
// const applyPatientController = async (req, res) => {
//     try {
//         const existingPatient = await patientModel.findOne({
//             userId: req.user.id,
//         });

//         if (existingPatient) {
//             return res.status(400).send({
//                 success: false,
//                 message: "Patient profile already exists",
//             });
//         }

//         const newPatient = new patientModel({
//             ...req.body,
//             userId: req.user.id,
//             status: "pending",
//         });

//         await newPatient.save();

//         const adminUser = await userModel.findOne({ isAdmin: true });

//         if (adminUser) {
//             adminUser.notification.push({
//                 type: "apply-patient-request",
//                 message: `${req.body.firstName} applied as patient`,
//                 data: {
//                     patientId: newPatient._id,
//                     onClickPath: "/admin/patients",
//                 },
//             });

//             await adminUser.save();
//         }

//         res.status(201).send({
//             success: true,
//             message: "Patient profile created successfully",
//         });
//     } catch (error) {
//         console.error("❌ APPLY PATIENT ERROR:", error);
//         res.status(500).send({
//             success: false,
//             message: error.message,
//         });
//     }
// };



const applyPatientController = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).send({
                success: false,
                message: "User ID missing",
            });
        }

        const existingPatient = await patientModel.findOne({ userId });

        if (existingPatient) {
            return res.status(400).send({
                success: false,
                message: "Patient profile already exists",
            });
        }

        const newPatient = new patientModel({
            ...req.body,
            userId,
            status: "pending",
        });

        await newPatient.save();

        const adminUser = await userModel.findOne({ isAdmin: true });

        if (adminUser) {
            adminUser.notification.push({
                type: "apply-patient-request",
                message: `${req.body.firstName} applied as patient`,
                data: {
                    patientId: newPatient._id,
                    onClickPath: "/admin/patients",
                },
            });
            await adminUser.save();
        }

        res.status(201).send({
            success: true,
            message: "Patient profile created successfully",
        });
    } catch (error) {
        console.error("❌ APPLY PATIENT ERROR:", error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};



//Update Patient Controller

const updatePatientController = async (req, res) => {
    try {
        const updatedPatient = await patientModel.findOneAndUpdate(
            { userId: req.params.userId },
            { ...req.body },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).send({
                success: false,
                message: "Patient profile not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Patient profile updated successfully",
            patient: updatedPatient,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating patient profile",
        });
    }
};



//Get Patient Info Controller
const getPatientProfileController = async (req, res) => {
    try {
        const patient = await patientModel.findOne({
            userId: req.params.userId,
        });

        if (!patient) {
            return res.status(200).send({
                success: false,
                message: "No patient profile found",
            });
        }

        res.status(200).send({
            success: true,
            patient,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching patient profile",
        });
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
        const appointments = await appointmentModel
            .find({ userId: req.body.userId })
            .populate("doctorId", "firstName lastName phone specialization feesPerConsultation")
            .sort({ date: 1 });

        res.status(200).send({
            success: true,
            data: appointments
        });

    } catch (error) {
        res.status(500).send({ success: false });
    }
};


const setRoleController = async (req, res) => {
    const { role } = req.body;

    try {
        const user = await userModel.findOne({ _id: req.body.userId });


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
    loginController, registerController, authController, applyDoctorController, applyPatientController, getAllNotificationController,
    deleteAllNotificationController, getAllDoctorListController, bookAppointmentController, getBookedSlotsController, userAppointmentController,
    getBookedSlotsWithStatusController, setRoleController, upload, uploadMedicalFileController, uploadPhotoController, 
    updatePatientController, getPatientProfileController, uploadCertificate, uploadCertificateController
};
