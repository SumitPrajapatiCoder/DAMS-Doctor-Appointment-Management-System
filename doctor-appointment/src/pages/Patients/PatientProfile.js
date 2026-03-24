import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hideLoading, showLoading } from "../../Redux/features/alertSlice";


const { Option } = Select;

const PatientProfile = () => {
    const { user } = useSelector((state) => state.user);
    const [patient, setPatient] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [medicalFile, setMedicalFile] = useState("");
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch existing patient info
    // const getPatientInfo = async () => {
    //     try {
    //         const res = await axios.post(
    //             "/api/v1/patient/get_Patient_Info",
    //             { userId: user._id },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             }
    //         );
    //         if (res.data.success) {
    //             setPatient(res.data.data);
    //             setImageUrl(res.data.data.image);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };



    const getPatientInfo = async () => {
        try {
            console.log("Params ID:", params.id);

            const res = await axios.post(
                "/api/v1/patient/get_Patient_Info",
                { userId: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log("API RESPONSE:", res.data);

            if (res.data.success) {
                setPatient(res.data.data);
                setImageUrl(res.data.data.image);
            }
        } catch (error) {
            console.log("ERROR:", error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            getPatientInfo();
        }
    }, [user]);

    // Handle profile update
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/patient/update-patient",
                {
                    ...values,
                    userId: user._id,
                    image: imageUrl,
                    medicalFile,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout>
            <h1>Patient Profile</h1>
            <Form
                layout="vertical"
                onFinish={handleFinish}
                className="m-3"
                initialValues={patient || {}}
            >
                    <h4>Personal Details</h4>
                    <Row gutter={20}>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter your first name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter your last name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter your phone number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: "email" }]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter your address" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Select gender">
                                    <Option value="Male">Male</Option>
                                    <Option value="Female">Female</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                label="Age"
                                name="age"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter your age" type="number" />
                            </Form.Item>
                        </Col>
                    </Row>

                <h4>Profile Photo</h4>
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={12} lg={8}>
                        <Upload
                            name="image"
                            showUploadList={false}
                            customRequest={async ({ file, onSuccess, onError }) => {
                                try {
                                    const formData = new FormData();
                                    formData.append("image", file);

                                    const res = await axios.post(
                                        "/api/v1/user/uploadPhoto",
                                        formData,
                                        {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                            },
                                        }
                                    );

                                    setImageUrl(res.data.path);
                                    toast.success("Image uploaded successfully");
                                    onSuccess("ok");
                                } catch (err) {
                                    toast.error("Upload failed");
                                    onError(err);
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                Upload New Profile Photo
                            </Button>
                        </Upload>

                        {imageUrl && (
                            <img
                                src={`http://localhost:8080${imageUrl}`}
                                alt="Patient"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    marginTop: 12,
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </Col>
                </Row>

                <h4 style={{ marginTop: 30 }}>Update Medical Report</h4>
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Upload Medical History (PDF / Image)">
                            <Upload
                                name="medicalFile"
                                showUploadList={false}
                                accept=".pdf,.jpg,.jpeg,.png"
                                customRequest={async ({ file, onSuccess, onError }) => {
                                    try {
                                        const formData = new FormData();
                                        formData.append("medicalFile", file);

                                        const res = await axios.post(
                                            "/api/v1/user/uploadMedicalFile",
                                            formData,
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                },
                                            }
                                        );

                                        setMedicalFile(res.data.path);
                                        toast.success("Medical history uploaded");
                                        onSuccess("ok");
                                    } catch (error) {
                                        toast.error("Upload failed");
                                        onError(error);
                                    }
                                }}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Upload Medical History
                                </Button>
                            </Upload>

                            {medicalFile && (
                                <p style={{ marginTop: 8, color: "green" }}>
                                    File uploaded successfully
                                </p>
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                        <Col xs={24} md={12} lg={8}>
                            <button className="btn btn-primary" type="submit">
                                Update Profile
                            </button>
                        </Col>
                    </Row>
                </Form>
           
        </Layout>
    );
};

export default PatientProfile;
