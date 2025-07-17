import React, { useEffect, useState } from 'react'
import Layout from './../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Form, Input, Row, TimePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hideLoading, showLoading } from '../../Redux/features/alertSlice';
import dayjs from 'dayjs';

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getDoctorInfo = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/get_Doctor_Info",
                { userId: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
                setImageUrl(res.data.data.image);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDoctorInfo();
        //eslint-disable-next-line
    }, []);

    const handle_Finish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/update_Profile",
                {
                    ...values,
                    userId: user._id,
                    image: imageUrl,
                    timings: [
                        dayjs(values.timings[0]).format("HH:mm"),
                        dayjs(values.timings[1]).format("HH:mm"),
                    ],
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
            <h1>Manage Profile</h1>
            {doctor && (
                <Form
                    layout="vertical"
                    onFinish={handle_Finish}
                    className="m-3"
                    initialValues={{
                        ...doctor,
                        timings: doctor.timings
                            ? [
                                dayjs(doctor.timings[0], "HH:mm"),
                                dayjs(doctor.timings[1], "HH:mm"),
                            ]
                            : [],
                    }}
                >
                    <h4>Personal Details</h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Phone No."
                                name="phone"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Phone No." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="E-mail"
                                name="email"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Web Site" name="website">
                                <Input placeholder="Enter Your Web Site" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <h4>Professional Details</h4>
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Specialization"
                                name="specialization"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Specialization" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Experience"
                                name="experience"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Experience" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Fees Per Consultation"
                                name="feesPerConsultation"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Your Fee" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item
                                label="Timing"
                                name="timings"
                                rules={[{ required: true }]}
                            >
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={24} lg={8}>
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
                                                    Authorization: `Bearer ${localStorage.getItem(
                                                        "token"
                                                    )}`,
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
                                <Button icon={<UploadOutlined />}>Upload New Profile Photo</Button>
                            </Upload>
                            {imageUrl && (
                                <img
                                    src={`http://localhost:8080${imageUrl}`}
                                    alt="Doctor"
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: "50%",
                                        marginTop: 10,
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                        </Col>

                        <Col xs={24} md={24} lg={8}></Col>
                        <Col xs={24} md={24} lg={8}>
                            <button
                                className="btn btn-primary doctor-form-btn"
                                type="submit"
                            >
                                Update
                            </button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Layout>
    );
};

export default Profile;


