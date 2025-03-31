const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getDoctorInfoController=async(req,res)=>{
    try{
        const doctor=await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({ message:'Getting Doctor Information SuccessFully',success:true,data:doctor})
    }catch(error){
        console.log(error);
        res.status(500).send({
            message: 'Error Getting During Fetching Doctor Information',
            success: false,
            error
        });
    }
}

const updateProfileController=async(req,res)=>{
    try{
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.body.userId },
            { $set: req.body },
            { new: true, runValidators: true } 
        );
        if (!doctor) {
            return res.status(404).send({ message: "Doctor Not Found", success: false });
        }
        res.status(201).send({ message:'Updating Doctor Information SuccessFully',success:true,data:doctor})
       
    }catch(error){
        console.log(error);
        res.status(500).send({
            message: 'Error Updating During  Doctor Information',
            success: false,
            error
        });
    }
 }

const getDoctorByIdController=async(req,res)=>{
    try{
        const doctor=await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({ message: 'Getting Single Doctor Information SuccessFully', success: true, data: doctor })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error During Getting Single Doctor Information',
            success: false,
            error
        });
    }
}


const doctorAppointmentController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        if (!doctor) {
            return res.status(404).send({
                message: "Doctor not found",
                success: false,
            });
        }

        const appointments = await appointmentModel
            .find({ doctorId: doctor._id })
            .populate("userId", "name email") 
            .sort({ date: 1 });

        res.status(200).send({
            message: "Getting Appointment List To Doctor Successfully",
            success: true,
            data: appointments,
        });
    } catch (error) {
        console.log("Error fetching doctor appointments:", error);
        res.status(500).send({
            message: "Error Doctor Appointment List",
            success: false,
            error,
        });
    }
};


const updateStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send({
                message: "Appointment not found",
                success: false,
            });
        }


        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).send({
                message: "Unauthorized to update this appointment",
                success: false,
            });
        }

        appointment.status = status;
        await appointment.save();

        const user = await userModel.findById(appointment.userId);
        if (user) {
            const notification = user.notification
            notification.push({
                type: 'Appointment-Status-Update',
                message: `Your appointment on ${ appointment.date } at ${ appointment.time } is now ${ status }`,
                onClickPath: '/user/appointment',
            });
        await user.save();
    }

        res.status(200).send({
        success: true,
        message: `Appointment ${ status } successfully`,
        });
    } catch (error) {
    console.log(error);
    res.status(500).send({
        message: "Error updating appointment status",
        success: false,
        error,
    });
}
};


module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController,
    doctorAppointmentController, updateStatusController}