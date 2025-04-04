const mongoose = require("mongoose")

const appointmentSchema=new mongoose.Schema({
  
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", 
        required: true,
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    doctorInfo: {
        type: String,
        required: true
    },
    userInfo: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default:'pending'
    },
    time:{
        type:String,
        required:true
    }
}, { timestamps: true })

const appointmentModel = mongoose.model('appointment', appointmentSchema)

module.exports=appointmentModel


