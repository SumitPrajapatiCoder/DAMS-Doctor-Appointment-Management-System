import React from "react";
import { Form, Input } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../Redux/features/alertSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch= useDispatch();

  // Form Handler
  const on_Finish_reg = async (values) => {
    console.log('Register Details = ',values);
    try {
      dispatch(showLoading())
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading())
      if (res.data.success) {
        toast.success("Registered Successfully!", { position: "top-right" });
        navigate("/login");
      } else {
        dispatch(hideLoading())
        toast.error(res.data.message, { position: "top-right" });
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error);
      toast.error("Already Registered", { position: "top-right" });
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" onFinish={on_Finish_reg} className="form-box">
        <h1 className="text-center">Registration Form</h1>
        <Form.Item label="Name" name="name">
          <Input type="text" required />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>
        <p className="text-center">
          <Link to="/login" className="m-4">
            Already Registered? Login Here
          </Link>
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </p>
      </Form>
    </div>
  );
};

export default Register;
