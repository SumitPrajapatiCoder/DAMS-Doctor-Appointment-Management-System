
const express = require("express");
const { loginController, registerController, authController, 
    applyDoctorController, applyPatientController, updatePatientController, getPatientProfileController, getAllNotificationController, deleteAllNotificationController, 
    getAllDoctorListController,bookAppointmentController,
    userAppointmentController,
    getBookedSlotsController, uploadCertificate,
    uploadCertificateController,
    getBookedSlotsWithStatusController,
    setRoleController, upload, uploadPhotoController, uploadMedicalFileController
    } = require("../controller/userControl");
const authMiddleware=require("../middlewares/authMiddleware");


//Route Object
const router = express.Router();


//Routes For Login/Register
router.post("/login", loginController);

router.post("/register", registerController);  

//Authorization
router.post('/get_User_data', authMiddleware, authController);

//Apply Doctor
router.post('/apply_doctor', authMiddleware, applyDoctorController);

// Apply Patient
router.post('/apply_patient', authMiddleware, applyPatientController);

// Update patient profile
router.post("/patient/update/:userId",authMiddleware,updatePatientController);

// Get patient profile (for prefill)
router.get("/patient/profile/:userId", authMiddleware, getPatientProfileController);

//Upload Photo 
router.post("/uploadPhoto", authMiddleware, upload.single("image"), uploadPhotoController);

//Apply Doctor Notification
router.post('/get_all_notification', authMiddleware, getAllNotificationController);

//Apply Doctor Delete Notification
router.post('/delete_all_notification', authMiddleware, deleteAllNotificationController);


//Get All Doctor list
router.get('/get_all_doctor_list', authMiddleware, getAllDoctorListController);


//Book Appointment
router.post('/book-appointment',authMiddleware,bookAppointmentController);

//Booking Availability
router.post('/get_booked_Slot', authMiddleware, getBookedSlotsController)

//fetching slots with status
router.post('/get_booked_slots_with_status', authMiddleware, getBookedSlotsWithStatusController);

//Appointment List
router.get('/user_Appointment', authMiddleware, userAppointmentController)

// Upload Degree Certificate
router.post(
    "/uploadCertificate",
    authMiddleware,
    uploadCertificate.single("certificate"),
    uploadCertificateController
);

// Route to update user's role (doctor or patient)
router.put('/setRole', authMiddleware, setRoleController);


// Upload Medical File
router.post(
    "/uploadMedicalFile",
    authMiddleware,
    upload.single("medicalFile"), 
    uploadMedicalFileController
);

module.exports = router;








