import React, { useEffect, useState } from 'react'
import Layout from './../../components/Layout';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Col, Form, Input, Row, TimePicker } from 'antd';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../../Redux/features/alertSlice';
import dayjs from 'dayjs';


const Profile=() => {
    const {user}=useSelector((state)=>state.user)
    const [doctor,setDoctor]=useState(null)
    const params=useParams()

    const getDoctorInfo=async()=>{
        try{
            const res = await axios.post('/api/v1/doctor/get_Doctor_Info', { userId: params.id }, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                setDoctor(res.data.data)
            }
        }catch(error){
            console.log(error);

        }
    }

    useEffect(()=>{
        getDoctorInfo();
        //eslint-disable-next-line
    }, [])
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handle_Finish = async (values) => {
        console.log("Updated values:", values);
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/doctor/update_Profile', { ...values, userId: user._id,
                timings: [
                    dayjs(values.timings[0]).format("HH:mm"),
                    dayjs(values.timings[1]).format("HH:mm")
                ]
             }, {
                headers: {
                    Authorization: `bearer ${localStorage.getItem('token')}`
                }
            }
            )
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
        <h1>Manage Profile</h1>
        {doctor && (
              <Form layout="vertical" onFinish={handle_Finish} className='m-3' initialValues={{
                ...doctor,
                  timings: doctor.timings
                      ? [
                          dayjs(doctor.timings[0], "HH:mm"),
                          dayjs(doctor.timings[1], "HH:mm")
                      ]
                      : []
              }}>
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
                          <button className='btn btn-primary doctor-form-btn' type='submit'>Update</button>
                      </Col>
                  </Row>
              </Form>
        )}
    </Layout>
  )
}

export default Profile




