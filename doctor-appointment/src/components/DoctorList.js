
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import doctorPhoto from "../Photo/doctorPhoto.JPG";   // default image

// const DoctorList = ({ doctor }) => {
//     const navigate = useNavigate();

//     // same logic – just safer image fallback
//     const doctorImage = doctor.image
//         ? `http://localhost:8080${doctor.image}`
//         : doctorPhoto;

//     return (
//         <div
//             className="card shadow-sm"
//             style={{
//                 width: "100%",
//                 height: "100%",
                
//                 cursor: "pointer",
//                 borderRadius: "15px",
//                 overflow: "hidden",
//                 transition: "transform 0.25s ease",
//                 border: "1px solid #e6e6e6"
//             }}
//            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
//         >

//             {/* CARD HEADER */}
//             <div
//                 className="card-header text-white text-center"
//                 style={{
//                     padding: "10px",
//                     fontSize: "1.1rem",
//                     fontWeight: "600",
//                     background: "linear-gradient(90deg,#2f6ad9,#2b78e4)"
//                 }}
//             >
//                 Dr. {doctor.firstName} {doctor.lastName}
//             </div>

//             {/* CARD BODY */}
//             <div
//                 className="card-body d-flex flex-column align-items-center text-center"
//                 style={{
//                     background: "#fafafa",
//                     padding: "18px"
//                 }}
//             >
//                 <img
//                     src={doctorImage}
//                     alt="Doctor"
//                     style={{
//                         width: "95px",
//                         height: "95px",
//                         borderRadius: "50%",
//                         objectFit: "cover",
//                         marginBottom: "12px",
//                         border: "3px solid #fff",
//                         boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
//                     }}
//                 />

//                 <p><b>Specialization:</b> {doctor.specialization}</p>
//                 <p><b>Experience:</b> {doctor.experience} years</p>
//                 <p><b>Fees:</b> ₹{doctor.feesPerConsultation}</p>
//                 <p><b>Phone:</b> {doctor.phone}</p>
//                 <p><b>Address:</b> {doctor.address}</p>
//                 <p><b>Time:</b> {doctor.timings[0]} - {doctor.timings[1]}</p>

//                 <button
//                     className="btn btn-primary mt-2"
//                     style={{
//                         width: "90%",
//                         fontWeight: "600",
//                         borderRadius: "6px"
//                     }}
//                     onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
//                 >
//                     Book Appointment
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DoctorList;









import React from "react";
import { useNavigate } from "react-router-dom";
import doctorPhoto from "../Photo/doctorPhoto.JPG";

const DoctorList = ({ doctor }) => {

    const navigate = useNavigate();

    const doctorImage = doctor.image
        ? `http://localhost:8080${doctor.image}`
        : doctorPhoto;

    return (

        <div
            className="doctor-card"
            onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
        >

            {/* Doctor Image */}

            <div className="doctor-image">
                <img src={doctorImage} alt="Doctor" />
            </div>

            {/* Doctor Info */}

            <div className="doctor-info">

                <h3 className="doctor-name">
                    Dr. {doctor.firstName} {doctor.lastName}
                </h3>

                <p className="doctor-specialization">
                    {doctor.specialization}
                </p>

                <p>
                    <b>Experience:</b> {doctor.experience} years
                </p>

                <p>
                    <b>Fees:</b> ₹{doctor.feesPerConsultation}
                </p>

                <p>
                    <b>Phone:</b> {doctor.phone}
                </p>

                <p>
                    <b>Address:</b> {doctor.address}
                </p>

                <p>
                    <b>Timing:</b> {doctor.timings[0]} - {doctor.timings[1]}
                </p>

                <button
                    className="book-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/book-appointment/${doctor._id}`);
                    }}
                >
                    Book Appointment
                </button>

            </div>

        </div>

    );
};

export default DoctorList;