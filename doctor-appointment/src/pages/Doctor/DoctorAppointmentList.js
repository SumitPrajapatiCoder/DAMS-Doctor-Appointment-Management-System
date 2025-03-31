
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Select, Spin, Input } from "antd";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import "react-toastify/dist/ReactToastify.css";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const DoctorAppointmentList = () => {
    const [appointment, setAppointment] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const getAppointment = async () => {
        try {
            const res = await axios.get("/api/v1/doctor/doctor_Appointment", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data.success) {
                setAppointment(res.data.data);
                setFilteredAppointments(res.data.data);
            } else {
                console.log("No Appointments:", res.data.message);
            }
        } catch (error) {
            console.log("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppointment();
    }, []);

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        const filtered = value === 'all' ? appointment : appointment.filter(app => app.status === value);
        setFilteredAppointments(filtered);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const searched = appointment.filter(app =>
            app.userId?.name.toLowerCase().includes(value) ||
            app.userId?.email.toLowerCase().includes(value)
        );
        setFilteredAppointments(searched);
    };

    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post("/api/v1/doctor/update_Status_Appointment_Doctor",
                { appointmentId: record._id, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-right" });
                getAppointment();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong During Updating Doctor Appointment", {
                position: "top-right",
            });
        }
    };

    const columns = [
       
        {
            title: "ID",
            dataIndex: "_id",
            render: (text, record) => (
                <span
                    style={{ color: "#1890ff", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate(`/doctor/book-appointment/${record.doctorId || record._id}`)}
                >
                    {record._id}
                </span>
            ),
        },
        {
            title: "Patient Name",
            render: (text, record) => <span>{record.userId?.name || "Unknown"}</span>,
        },
        {
            title: "Patient Email",
            render: (text, record) => <span>{record.userId?.email || "N/A"}</span>,
        },
        {
            title: "Date & Time",
            render: (text, record) => (
                <span>
                    {record.date} - {record.time}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'approved':
                        color = 'green';
                        break;
                    case 'pending':
                        color = 'gold';
                        break;
                    case 'rejected':
                        color = 'volcano';
                        break;
                    default:
                        color = 'blue';
                        break;
                }
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: "Action",
            render: (text, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    {record.status === "pending" ? (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={() => handleStatus(record, "approved")}
                            >
                             Approve
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleStatus(record, "rejected")}
                            >
                            Reject
                            </button>
                        </>
                    ) : (
                        <Tag color={record.status === "approved" ? "green" : "volcano"}>
                            {record.status.toUpperCase()}
                        </Tag>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Doctor Appointment List</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                <Select
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    style={{ width: 200 }}
                >
                    <Option value="all">All</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="rejected">Rejected</Option>
                </Select>

                <Input
                    placeholder="Search Patient Name or Email"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                />
            </div>

            {loading ? (
                <Spin tip="Loading appointments..." size="large" style={{ display: 'block', margin: '0 auto' }} />
            ) : (
                <Table columns={columns} dataSource={filteredAppointments} rowKey="_id" pagination={{ pageSize: 8 }} />
            )}
        </Layout>
    );
};

export default DoctorAppointmentList;
