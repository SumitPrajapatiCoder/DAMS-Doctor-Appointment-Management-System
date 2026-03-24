const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getAllUsersController,
    getAllPatientsController,
    getAllDoctorsController,
    changeAccountStatusController,
    blockUserController,
    deletePatientController,
    deleteDoctorController,
    changePatientStatusController,
    getSinglePatientController, // ✅ ONLY ADD
} = require("../controller/adminControl");

const router = express.Router();

// ================= GET USERS =================
router.get("/get_All_Users", authMiddleware, getAllUsersController);

// ================= GET DOCTORS =================
router.get("/get_All_Doctors", authMiddleware, getAllDoctorsController);

// ================= GET PATIENTS =================
router.get("/get_All_Patients", authMiddleware, getAllPatientsController);

// ================= GET SINGLE PATIENT (✅ ONLY ADDITION) =================
router.get(
    "/get-patient/:id",
    authMiddleware,
    getSinglePatientController
);

router.post(
    "/change-patient-status",
    authMiddleware,
    changePatientStatusController
);

// ================= CHANGE ACCOUNT STATUS =================
router.post("/changes_Account_Status", authMiddleware, changeAccountStatusController);

// ================= BLOCK / UNBLOCK USER =================
router.post("/block_user", authMiddleware, blockUserController);

// ================= DELETE PATIENT =================
router.delete(
    "/delete-patient/:patientId",
    authMiddleware,
    deletePatientController
);

// ================= DELETE DOCTOR =================
router.delete(
    "/delete-doctor/:doctorId",
    authMiddleware,
    deleteDoctorController
);

module.exports = router;
