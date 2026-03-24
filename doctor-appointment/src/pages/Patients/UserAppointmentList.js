import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag } from "antd";
import Layout from "../../components/Layout";

const UserAppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        const res = await axios.get("/api/v1/user/user_Appointment", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (res.data.success) {
            setAppointments(res.data.data);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title: "Doctor",
            render: (_, record) =>
                `${record.doctorId.firstName} ${record.doctorId.lastName}`,
        },
        {
            title: "Specialization",
            dataIndex: ["doctorId", "specialization"],
        },
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Time",
            dataIndex: "time",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: status => (
                <Tag color={status === "approved" ? "green" : status === "rejected" ? "red" : "gold"}>
                    {status.toUpperCase()}
                </Tag>
            )
        }
    ];

    return (
        <Layout>
            <h2 style={{ textAlign: "center" }}>My Appointments</h2>
            <Table columns={columns} dataSource={appointments} rowKey="_id" />
        </Layout>
    );
};

export default UserAppointmentList;
