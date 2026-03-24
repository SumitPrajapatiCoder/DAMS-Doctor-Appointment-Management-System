import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { Card, Button } from "antd";

const RecommendedDoctors = () => {
    const [doctors, setDoctors] = useState([]);

    const getRecommendedDoctors = async () => {
        const res = await axios.get("/api/v1/user/recommend-doctors", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (res.data.success) {
            setDoctors(res.data.data);
        }
    };

    useEffect(() => {
        getRecommendedDoctors();
    }, []);

    return (
        <Layout>
            <h2 style={{ textAlign: "center" }}>Recommended Doctors</h2>

            {doctors.length === 0 ? (
                <p style={{ textAlign: "center" }}>No recommendations available</p>
            ) : (
                doctors.map((doctor) => (
                    <Card
                        key={doctor._id}
                        style={{ marginBottom: "15px" }}
                        title={`${doctor.firstName} ${doctor.lastName}`}
                    >
                        <p><b>Specialization:</b> {doctor.specialization}</p>
                        <p><b>Experience:</b> {doctor.experience} years</p>
                        <p><b>Fees:</b> ₹{doctor.feesPerConsultation}</p>

                        <Button type="primary">
                            Book Appointment
                        </Button>
                    </Card>
                ))
            )}
        </Layout>
    );
};

export default RecommendedDoctors;
