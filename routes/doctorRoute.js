const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentController, updateStatusController } = require("../controller/doctor.Control");


const router = express.Router();

router.post('/get_Doctor_Info', authMiddleware, getDoctorInfoController);

router.post('/update_Profile', authMiddleware, updateProfileController);

router.post('/get_Doctor_By_Id', authMiddleware, getDoctorByIdController);

router.get('/doctor_Appointment',authMiddleware,doctorAppointmentController);

router.post('/update_Status_Appointment_Doctor',authMiddleware,updateStatusController);



module.exports = router;