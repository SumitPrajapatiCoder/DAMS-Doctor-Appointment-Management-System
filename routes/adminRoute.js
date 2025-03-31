const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, blockUserController } = require("../controller/adminControl");

const router = express.Router();

//get Users List
router.get('/get_All_Users', authMiddleware, getAllUsersController);

//get Doctors List
router.get('/get_All_Doctors', authMiddleware, getAllDoctorsController);

//Account Status
router.post('/changes_Account_Status',authMiddleware, changeAccountStatusController);

// Block/Unblock User route
router.post('/block_user', authMiddleware, blockUserController);

module.exports = router;