import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Tag, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get('/api/v1/admin/get_All_Users', {
        headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { getUsers(); }, []);

  const handleBlockUser = async (record) => {
    try {
      const res = await axios.post(
        '/api/v1/admin/block_user',
        { userId: record._id, status: !record.isBlocked },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message, { position: "top-right" });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update user status', { position: "top-right" });
    }
  };


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = users.filter(user =>
      user.name.toLowerCase().includes(value) || user.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filteredData);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'E-mail', dataIndex: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
    {
      title: 'Doctor',
      dataIndex: 'isDoctor',
      render: (text, record) => (<Tag color={record.isDoctor ? 'blue' : 'volcano'}>{record.isDoctor ? 'Yes' : 'No'}</Tag>),
      filters: [
        { text: 'Doctors', value: true },
        { text: 'Users', value: false }
      ],
      onFilter: (value, record) => record.isDoctor === value
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      render: (isBlocked) => (
        <Tag color={isBlocked ? 'red' : 'green'} style={{ fontWeight: 'light' }}>
          {isBlocked ? 'Blocked' : 'Active'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: false },
        { text: 'Blocked', value: true }
      ],
      onFilter: (value, record) => record.isBlocked === value
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <Button
          danger={record.isBlocked ? false : true}
          type='primary'
          onClick={() => handleBlockUser(record)}
        >
          {record.isBlocked ? 'Unblock' : 'Block'}
        </Button>
      )
    }
  ];

  return (
    <Layout>
      <h1 className='text-center'>All Users List</h1>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <Input
          placeholder="Search Users..."
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
          style={{ width: 300, textAlign: 'center' }}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 7}}
        className='user-table'
      />
    </Layout>
  );
};

export default Users;
