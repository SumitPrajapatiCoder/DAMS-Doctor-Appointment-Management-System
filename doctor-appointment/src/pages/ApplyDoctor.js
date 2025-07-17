import React from 'react'
import Layout from './../components/Layout';
import { Col, Form, Input, Row, TimePicker, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../Redux/features/alertSlice';
import axios from 'axios';
import dayjs from 'dayjs';

const ApplyDoctor = () => {
    const [imageUrl, setImageUrl] = useState("");
    const { user } = useSelector((state) => state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handle_Finish = async (values) => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/apply_doctor', {
                ...values, userId: user._id,
                image: imageUrl,
                timings: [
                    dayjs(values.timings[0]).format("HH:mm"),
                    dayjs(values.timings[1]).format("HH:mm")
                ]
            }, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-right" });
                navigate('/')
            } else {
                toast.error(res.data.message, { position: "top-right" });
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error);
            toast.error('Something went Wrong', { position: "top-right" });
        }
    };
    return (
        <Layout>
            <h1 className='text-center '>Apply As Doctor</h1>
            <Form layout="vertical" onFinish={handle_Finish} className='m-3'>
                <h4 className=''>Personal Details</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Phone No."
                            name="phone"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Phone No.' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="E-mail"
                            name="email"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Email' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Web Site"
                            name="website">
                            <Input type="text" placeholder='Enter Your Web Site' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Address"
                            name="address"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Address' />
                        </Form.Item>
                    </Col>
                </Row>

                <h4 className=''>Professional Details</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Specialization"
                            name="specialization"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Specialization' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Experience"
                            name="experience"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Experience' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Fees Per Consultation"
                            name="feesPerConsultation"
                            required rules={[{ required: true }]}>
                            <Input type="text" placeholder='Enter Your Fee' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item
                            label="Timing"
                            name="timings"
                            required rules={[{ required: true }]}>
                            <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}></Col>
                    <Col xs={24} md={24} lg={8}>
                        <button className='btn btn-primary doctor-form-btn' type='submit'>Submit</button>
                    </Col>
                </Row>
                <Row>
                    <Upload
                        name="image"
                        showUploadList={false}
                        customRequest={async ({ file, onSuccess, onError }) => {
                            try {
                                const formData = new FormData();
                                formData.append("image", file);
                                const res = await axios.post("/api/v1/user/uploadPhoto", formData, {
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                });
                                setImageUrl(res.data.path);
                                toast.success("Image uploaded");
                                onSuccess("ok");
                            } catch (err) {
                                toast.error("Upload failed");
                                onError(err);
                            }
                        }}
                    >
                        <Button icon={<UploadOutlined />} className="mb-3">
                            Upload Doctor Photo
                        </Button>
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
                </Row>
            </Form>
        </Layout>
    )
}

export default ApplyDoctor