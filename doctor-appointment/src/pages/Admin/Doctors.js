import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Button, Tag, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get('/api/v1/admin/get_All_Doctors', {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        setFilteredDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountUpdate = async (record, status) => {
    try {
      const res = await axios.post('/api/v1/admin/changes_Account_Status', {
        doctorId: record._id,
        userId: record.userId,
        status: status
      }, {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });

      if (res.data.success) {
        toast.success(res.data.message, { position: "top-right" });
        getDoctors();
      }
    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong During Update Account', { position: "top-right" });
    }
  };

  useEffect(() => { getDoctors(); }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = doctors.filter(doctor =>
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(value) ||
      doctor.email.toLowerCase().includes(value) ||
      doctor.specialization.toLowerCase().includes(value)
    );
    setFilteredDoctors(filteredData);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName)
    },
    { title: 'E-mail', dataIndex: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    { title: 'Phone No.', dataIndex: 'phone', sorter: (a, b) => a.phone.localeCompare(b.phone) },
    { title: 'Specialization', dataIndex: 'specialization', sorter: (a, b) => a.specialization.localeCompare(b.specialization) },
    { title: 'Fees', dataIndex: 'feesPerConsultation',
         render: (fees) => `₹${fees}`, sorter: (a, b) => a.feesPerConsultation - b.feesPerConsultation },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className='d-flex gap-2'>
          {record.status === 'pending' ? (
            <>
              <Button type='primary' onClick={() => handleAccountUpdate(record, 'approved')}>Approve</Button>
              <Button danger onClick={() => handleAccountUpdate(record, 'rejected')}>Reject</Button>
            </>
          ) : record.status === 'approved' ? (
            <Button danger onClick={() => handleAccountUpdate(record, 'released')}>Release Doctor</Button>
          ) : record.status === 'released' ? (
            <Button type='primary' onClick={() => handleAccountUpdate(record, 'approved')}>Renew Doctor</Button>
          ) : (
            <Tag color='grey'>{record.status.toUpperCase()}</Tag>
          )}
        </div>
      )
    }

  ];

  return (
    <Layout>
      <h1 className='text-center mb-4'>All Doctors List</h1>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <Input
          placeholder="Search Doctors..."
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
          style={{ width: 300, textAlign: 'center' }}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredDoctors}
        rowKey='_id'
        pagination={{ pageSize: 7 }}
        bordered
        scroll={{ x: true }}
      />
    </Layout>
  );
};

export default Doctors;
