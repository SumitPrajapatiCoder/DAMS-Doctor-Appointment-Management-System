import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Table, Tag, Select, Spin, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
      const navigate = useNavigate();

    useEffect(() => {
        const getAppointment = async () => {
            try {
                const res = await axios.get('/api/v1/user/user_Appointment', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.data.success) {
                    setAppointments(res.data.data);
                    setFilteredAppointments(res.data.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAppointment();
    }, []);

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        const filtered = value === 'all' ? appointments : appointments.filter(app => app.status === value);
        setFilteredAppointments(filtered);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const searched = appointments.filter(app =>
            app.doctorId?.firstName.toLowerCase().includes(value) ||
            app.doctorId?.lastName.toLowerCase().includes(value) ||
            app.doctorId?.specialization.toLowerCase().includes(value)
        );

        setFilteredAppointments(searched);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            render: (id, record) => (
                <span
                    style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate(`/doctor/book-appointment/${record.doctorId?._id}`)}
                >
                    {id}
                </span>
            ),
        },
        {
            title: 'Doctor Name',
            render: (text, record) => (
                <span>{record.doctorId?.firstName} {record.doctorId?.lastName}</span>
            )
        },
        {
            title: 'Doctor Phone',
            dataIndex: ['doctorId', 'phone']
        },
        {
            title: 'Doctor Specialization',
            dataIndex: ['doctorId', 'specialization']
        },
        {
            title: 'Doctor Fees',
            dataIndex: ['doctorId', 'feesPerConsultation'],
            render: (fees) => `₹${fees}`,
        },
        {
            title: 'Date & Time',
            render: (text, record) => (
                <span>{record.date} - {record.time}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'approved':
                        color = 'green';
                        break;
                    case 'pending':
                        color = 'gold';
                        break;
                    case 'rejected':
                        color = 'volcano';
                        break;
                    default:
                        color = 'blue';
                        break;
                }
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        }

    ];
    return (
        <Layout>
            <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Appointment List</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
               
                <Select
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    style={{ width: 200 }}
                >
                    <Option value="all">All</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="rejected">Rejected</Option>
                </Select>

                
                <Input
                    placeholder="Search by name or specialization..."
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                />
            </div>

           
            {loading ? (
                <Spin tip="Loading appointments..." size="large" style={{ display: 'block', margin: '0 auto' }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredAppointments}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                />
            )}
        </Layout>
    );

};

export default AppointmentList;
