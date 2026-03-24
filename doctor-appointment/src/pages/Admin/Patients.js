import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, Button, Tag, Input, Space, Modal, Descriptions } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
const BASE_URL = "http://localhost:8080";


const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [searchText, setSearchText] = useState("");

    // 🔹 NEW STATES (only added)
    const [open, setOpen] = useState(false);
    const [patientDetail, setPatientDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const getPatients = async () => {
        try {
            const res = await axios.get(
                "/api/v1/admin/get_All_Patients",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                setPatients(res.data.data);
            }
        } catch (error) {
            toast.error("Failed to load patients");
        }
    };

    useEffect(() => {
        getPatients();
    }, []);

    // 🔍 Search (unchanged)
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        getPatients(value);
    };

    // 🔒 Block / Unblock (unchanged)
    const handleBlockToggle = async (record) => {
        try {
            const res = await axios.post(
                "/api/v1/admin/block_user",
                { userId: record._id, status: !record.isBlocked },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                getPatients(searchText);
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    // 🗑️ Delete Patient (unchanged)
    const handleDeletePatient = async (record) => {
        try {
            const res = await axios.delete(
                `/api/v1/admin/delete-patient/${record._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                getPatients();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };


    const handlePatientStatus = async (patientId, status) => {
        try {
            const res = await axios.post(
                "/api/v1/admin/change-patient-status",
                { patientId, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                getPatients();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // 🆕 FETCH SINGLE PATIENT DETAIL
    const fetchPatientDetail = async (patientId) => {
        try {
            setLoadingDetail(true);
            const res = await axios.get(
                `/api/v1/admin/get-patient/${patientId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                setPatientDetail(res.data.data);
                setOpen(true);
            }
        } catch (error) {
            toast.error("Failed to fetch patient details");
        } finally {
            setLoadingDetail(false);
        }
    };

    const columns = [
        {
            title: "Name",
            render: (_, record) =>
                `${record.firstName || ""} ${record.lastName || ""}`.trim() || "—",
            sorter: (a, b) =>
                (a.firstName || "").localeCompare(b.firstName || ""),
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Role",
            render: () => <Tag color="blue">PATIENT</Tag>,
        },
        {
            title: "Medical Records",
            render: (_, record) => record.medicalHistory?.length || 0,
        },

        {
            title: "Approval",
            render: (_, record) => {
                const color =
                    record.status === "approved"
                        ? "green"
                        : record.status === "rejected"
                            ? "red"
                            : "orange";

                return <Tag color={color}>{record.status?.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Status",
            render: (_, record) => (
                <Tag color={record.isBlocked ? "red" : "green"}>
                    {record.isBlocked ? "BLOCKED" : "ACTIVE"}
                </Tag>
            ),
        },
        // {
        //     title: "Action",
        //     render: (_, record) => (
        //         <Space>
        //             {/* 🆕 VIEW INFO BUTTON */}
        //             <Button
        //                 type="primary"
        //                 onClick={() => fetchPatientDetail(record._id)}
        //             >
        //                 View Info
        //             </Button>

        //             <Button
        //                 danger={!record.isBlocked}
        //                 onClick={() => handleBlockToggle(record)}
        //             >
        //                 {record.isBlocked ? "Unblock" : "Block"}
        //             </Button>

        //             <Button danger onClick={() => handleDeletePatient(record)}>
        //                 Delete
        //             </Button>
        //         </Space>
        //     ),
        // },



        {
            title: "Action",
            render: (_, record) => (
                <Space>
                    {record.status === "pending" && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => handlePatientStatus(record._id, "approved")}
                            >
                                Approve
                            </Button>

                            <Button
                                danger
                                onClick={() => handlePatientStatus(record._id, "rejected")}
                            >
                                Reject
                            </Button>
                        </>
                    )}

                    <Button
                        type="primary"
                        onClick={() => fetchPatientDetail(record._id)}
                    >
                        View Info
                    </Button>

                    <Button
                        danger={!record.isBlocked}
                        onClick={() => handleBlockToggle(record)}
                    >
                        {record.isBlocked ? "Unblock" : "Block"}
                    </Button>

                    <Button danger onClick={() => handleDeletePatient(record)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <h1 className="text-center">All Patients</h1>

            <Space
                style={{
                    marginBottom: 16,
                    justifyContent: "center",
                    display: "flex",
                }}
            >
                <Input
                    placeholder="Search Patients..."
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={patients}
                rowKey="_id"
                pagination={{ pageSize: 7 }}
                bordered
            />

            {/* 🆕 PATIENT DETAIL MODAL */}
            <Modal
                title="Patient Information"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={700}
                confirmLoading={loadingDetail}
            >
                {patientDetail && (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Name">
                            {patientDetail.name ||
                                `${patientDetail.firstName || ""} ${patientDetail.lastName || ""}`}
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            {patientDetail.email}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phone">
                            {patientDetail.phone || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Gender">
                            {patientDetail.gender || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Age">
                            {patientDetail.age || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Medical Report">
                            {patientDetail.medicalHistoryFile ? (
                                <Button
                                    type="link"
                                    onClick={() =>
                                        window.open(
                                            `${BASE_URL}${patientDetail.medicalHistoryFile}`,
                                            "_blank",
                                            "noopener,noreferrer"
                                        )
                                    }
                                >
                                    View Medical Report
                                </Button>
                            ) : (
                                "No Report Uploaded"
                            )}
                        </Descriptions.Item>



                        <Descriptions.Item label="Registered On">
                            {new Date(
                                patientDetail.createdAt
                            ).toLocaleDateString()}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </Layout>
    );
};

export default Patients;
