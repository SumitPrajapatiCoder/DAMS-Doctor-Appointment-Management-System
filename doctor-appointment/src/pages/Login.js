import React from 'react';
import { Form, Input} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../style/Login_Style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useDispatch} from 'react-redux'
import { showLoading,hideLoading } from '../Redux/features/alertSlice';


const Login=()=> {
      const navigate = useNavigate();
      const dispatch=useDispatch();
      
    //Form Handler
    const on_Finish_log = async(values) => {
        console.log('Login Details = ',values);
        try{
            dispatch(showLoading())
            const res = await axios.post("/api/v1/user/login", values);
            dispatch(hideLoading())
            if(res.data.success){
                localStorage.setItem("token",res.data.token);
                toast.success("Login Done Successfully!", { position: "top-right" });
                navigate("/")
                window.location.reload(); 
            }else{
                toast.error(res.data.message, { position: "top-right" });
            }
        }catch(error){
            dispatch(hideLoading())
            console.log(error)
            toast.error("Already Login", { position: "top-right" });
        }
    }

  return (
      <div className="form-container">
          <Form layout="vertical" onFinish={on_Finish_log} className="form-box">
              <h1 className="text-center">Login Form</h1>
              <Form.Item label="Email" name="email">
                  <Input type="email" required></Input>
              </Form.Item>
              <Form.Item label="Password" name="password">
                  <Input type="password" required></Input>
              </Form.Item>
              <p className="text-center">
                  <Link to="/register" className='m-4 '>Not User Register Here</Link>
                  <button className='btn btn-primary' type='submit'>Login</button>
              </p>

          </Form>
      </div>
  )
}

export default Login
