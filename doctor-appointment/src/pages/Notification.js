import React from 'react';
import Layout from '../components/Layout';
import { Tabs, Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hideLoading, showLoading } from '../Redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Notification() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                'api/v1/user/get_all_notification',
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            window.location.reload();
            if (res.data.success) {
                toast.success(res.data.message, { position: 'top-right' });
            } else {
                toast.error(res.data.message, { position: 'top-right' });
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            toast.error('Something Went Wrong Mark Read Notification', { position: 'top-right' });
        }
    };
    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "api/v1/user/delete_all_notification",
                { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-right" });
                 window.location.reload(); 
            } else {
                toast.error(res.data.message, { position: "top-right" });
            }
        } catch (error) {
            console.log(error);
            dispatch(hideLoading());
            toast.error("Something Went Wrong Read Delete Notification", { position: "top-right" });
        }
    };


    return (
        <Layout>
            <h1 className="p-3 text-center text-primary"> Notification Center</h1>
            <Tabs centered animated>
                <Tabs.TabPane
                    tab={<Badge count={user?.notification.length}>Un-Read</Badge>}
                    key={0}
                >
                    <div className="d-flex justify-content-end mb-2">
                        <h4 className="p-2 text-success" style={{ cursor: 'pointer' }} onClick={handleMarkAllRead}>
                             Mark All Read
                        </h4>
                    </div>
                    {user?.notification.length ? (
                        user?.notification.map((notificationMSG, index) => (
                            <div
                                key={index}
                                className="card mb-2 shadow-sm bg-light border-primary"
                                onClick={() => navigate(notificationMSG.onClickPath)}
                                style={{ cursor: 'pointer', transition: '0.3s', borderRadius: '10px' }}
                                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <div className="card-text p-3">
                                     {notificationMSG.message}
                                </div>
                            </div>
                        ))
                    ) : (
                        <h5 className="text-center text-secondary">No New Notifications </h5>
                    )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Read" key={1}>
                    <div className="d-flex justify-content-end mb-2">
                        <h4 className="p-2 text-danger" style={{ cursor: 'pointer' }} onClick={handleDeleteAllRead}>
                            Delete All Read
                        </h4>
                    </div>
                    {user?.seenNotification.length ? (
                        user?.seenNotification.map((notificationMSG, index) => (
                            <div
                                key={index}
                                className="card mb-2 shadow-sm bg-light border-secondary"
                                onClick={() => navigate(notificationMSG.onClickPath)}
                                style={{ cursor: 'pointer', transition: '0.3s', borderRadius: '10px' }}
                                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                <div className="card-text p-3 text-muted">
                                     {notificationMSG.message}
                                </div>
                            </div>
                        ))
                    ) : (
                        <h5 className="text-center text-secondary">No Read Notifications</h5>
                    )}
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    );
}

export default Notification;




