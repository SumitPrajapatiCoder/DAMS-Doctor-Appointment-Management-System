
const express = require("express");
const { loginController, registerController, authController, 
    applyDoctorController, getAllNotificationController, deleteAllNotificationController, 
    getAllDoctorListController,bookAppointmentController,
    userAppointmentController,
    getBookedSlotsController,
    getBookedSlotsWithStatusController,
    setRoleController,upload,uploadPhotoController,
    setHasRoleStatusController} = require("../controller/userControl");
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


router.put('/setRole', authMiddleware, setRoleController);
// Route to update user's role (doctor or patient)

module.exports = router;

