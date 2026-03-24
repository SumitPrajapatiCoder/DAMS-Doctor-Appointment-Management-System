import React from 'react'
import Layout from '../../components/Layout';
import { Col, Form, Input, Row, TimePicker, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../../Redux/features/alertSlice';
import axios from 'axios';
import dayjs from 'dayjs';

const ApplyDoctor = () => {
    const [imageUrl, setImageUrl] = useState("");
    const [certificateUrl, setCertificateUrl] = useState("");
    const { user } = useSelector((state) => state.user)

    const [previewImage, setPreviewImage] = useState("");
    const [previewCertificate, setPreviewCertificate] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handle_Finish = async (values) => {
        try {
            if (!certificateUrl) {
                toast.error("Degree certificate is mandatory");
                return;
            }
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/apply_doctor', {
                ...values, userId: user._id,
                image: imageUrl,
                degreeCertificate: certificateUrl, 
                timings: [
                    dayjs(values.timings[0]).format("hh:mm A"),
                    dayjs(values.timings[1]).format("hh:mm A")
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


    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage);
            if (previewCertificate) URL.revokeObjectURL(previewCertificate);
        };
    }, [previewImage, previewCertificate]);

    return (
        <Layout>
            <h1 className='text-center '>Apply As Doctor</h1>
            <Form layout="vertical" onFinish={handle_Finish} className='m-3'>
                <h4 className='text-center'>Personal Details</h4>
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

                <h4 className='text-center'>Professional Details</h4>
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
                            <TimePicker.RangePicker
                                format="hh:mm A"
                                use12Hours
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={24} lg={8}></Col>
                    
                </Row>
              

                <Row gutter={[20, 20]} align="middle">

                    {/* Doctor Image Upload */}
                    <Col xs={24} md={12}>
                        <Upload
                            name="image"
                            showUploadList={false}
                            customRequest={async ({ file, onSuccess, onError }) => {
                                try {
                                    // ✅ LOCAL PREVIEW
                                    setPreviewImage(URL.createObjectURL(file));

                                    const formData = new FormData();
                                    formData.append("image", file);

                                    const res = await axios.post("/api/v1/user/uploadPhoto", formData, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                    });

                                    setImageUrl(res.data.path); // for backend
                                    toast.success("Image uploaded");
                                    onSuccess("ok");
                                } catch (err) {
                                    toast.error("Upload failed");
                                    onError(err);
                                }
                            }}
                        >

                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Doctor"
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        textAlign: "center",
                                    }}
                                />
                            )}
                            <Button icon={<UploadOutlined />} block>
                                Upload Doctor Photo
                            </Button>
                        </Upload>
                    </Col>

                    {/* Certificate Upload */}
                    <Col xs={24} md={12}>

                        {/* Upload Button */}
                        <Upload
                            name="certificate"
                            showUploadList={false}
                            customRequest={async ({ file, onSuccess, onError }) => {
                                try {
                                    // ✅ preview
                                    const preview = URL.createObjectURL(file);
                                    setPreviewCertificate(preview);

                                    console.log("Selected file:", file);

                                    const formData = new FormData();
                                    formData.append("certificate", file);

                                    const res = await axios.post(
                                        "/api/v1/user/uploadCertificate",
                                        formData,
                                        {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                            },
                                        }
                                    );

                                    console.log("Upload response:", res.data);

                                    // ✅ IMPORTANT FIX
                                    setCertificateUrl(res.data.path || res.data.url);

                                    toast.success("Certificate uploaded");
                                    onSuccess("ok");
                                } catch (err) {
                                    toast.error("Upload failed");
                                    onError(err);
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />} block>
                                Upload Degree Certificate
                            </Button>
                        </Upload>

                        {/* ✅ Preview OUTSIDE Upload */}
                        {previewCertificate && (
                            <div style={{ marginTop: 10 }}>
                                <iframe
                                    src={previewCertificate}
                                    title="Certificate"
                                    style={{
                                        width: "100%",
                                        height: "300px",
                                        border: "1px solid #ddd",
                                        borderRadius: 10,
                                    }}
                                />
                            </div>
                        )}

                        {/* Error Message */}
                        {!certificateUrl && (
                            <p style={{ color: "red", marginTop: 5 }}>
                                Degree certificate is required
                            </p>
                        )}

                    </Col>

                    {/* <Col xs={24} md={12} style={{ textAlign: "center" }}>
                        {certificateUrl && (
                            <iframe
                                src={`http://localhost:8080${certificateUrl}`}
                                title="Certificate Preview"
                                style={{
                                    width: "100%",
                                    height: 150,
                                    border: "1px solid #ddd",
                                    borderRadius: 8,
                                }}
                            />
                        )}
                    </Col> */}

                </Row>

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <button
                        className='btn btn-primary doctor-form-btn'
                        type='submit'
                        style={{
                            width: "200px",
                            height: "45px",
                            fontSize: "16px"
                        }}
                    >
                        Submit
                    </button>
                </div>
            </Form>
        </Layout>
    )
}

export default ApplyDoctor