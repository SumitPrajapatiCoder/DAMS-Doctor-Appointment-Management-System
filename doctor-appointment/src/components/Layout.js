import React from 'react';
import '../style/Layout_Style.css';
import { adminMenu, userMenu, applyAsDoctorMenu } from '../Data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { Badge } from 'antd';
const Layout = ({ children }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const userRole = localStorage.getItem('role');
    const isNewUser = !user?.isDoctor && !user?.isAdmin;



    const handle_log_out = () => {
        localStorage.clear();
        toast.success("Logout Successfully!", { position: "top-right" });
        navigate('/login');
    };


    // Doctor Menu
    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'fa-solid fa-house'
        },
        {
            name: 'Appointment',
            path: '/doctor_appointment',
            icon: 'fa-solid fa-list'
        },
        {
            name: 'Update Profile',
            path: `/doctor/profile/${user?._id}`,
            icon: 'fa-solid fa-user'
        },
    ];


    let Slidebar = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : [...userMenu];
    if (isNewUser && userRole === 'doctor' && !Slidebar.some(item => item.path === '/apply_doctor')) {
        Slidebar.push(applyAsDoctorMenu);
    }

    return (
        <>
            <div className="main">
                <div className="layout">
                    <div className="sidebar">
                        <div className="logo">
                            <h6>Menu Bar</h6><hr />
                        </div>
                        <div className="menu">
                            {Slidebar.map((menu) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <div key={menu.path} className={`menu_item ${isActive ? 'active' : ''}`}>
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}>{menu.name}</Link>
                                    </div>
                                );
                            })}

                            <div className={`menu_item`} onClick={handle_log_out} style={{ cursor: "pointer" }}>
                                <i className='fa-solid fa-right-from-bracket'></i>
                                Logout
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="header">
                            <div className="header_content" style={{ cursor: "pointer" }}>
                                <Badge count={user?.notification?.length || 0} onClick={() => { navigate('/notification') }}>
                                    <i className="fa-solid fa-bell bell-icon" style={{ fontSize: "1.8rem" }} ></i>
                                </Badge>
                                
                                <Link to='/profile' className='userName'>{user?.name}</Link>
                            </div>
                        </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
