import React from "react";
import { useNavigate } from "react-router-dom";


const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();
    const doctorImage = doctor.image || require("../Photo/doctorPhoto.JPG");

    return (
        <div
            className="card shadow-lg"
            style={{
                width: "100%",
                maxWidth: "280px",
                margin: "10px",
                cursor: "pointer",
                borderRadius: "15px",
                overflow: "hidden",
                transition: "transform 0.3s",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <div
                className="card-header bg-primary text-white text-center"
                style={{ padding: "10px 0", fontSize: "1.2rem", fontWeight: "bold" }}
            >
                Dr. {doctor.firstName} {doctor.lastName}
            </div>

            <div
                className="card-body p-3 d-flex flex-column align-items-center"
                style={{ backgroundColor: "#f9f9f9" }}
            >
                <img
                    src={doctorImage}
                    alt="Doctor"
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "10px",
                    }}
                />
                <p>
                    <b>Specialization:</b> {doctor.specialization}
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
                    <b>Time:</b> {doctor.timings[0]} - {doctor.timings[1]}
                </p>

                <button
                    className="btn btn-primary mt-2"
                    style={{ cursor: "pointer", width: "80%", fontWeight: "bold" }}
                    onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default DoctorList;




