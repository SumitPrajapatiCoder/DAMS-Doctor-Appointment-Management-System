import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Button, Tag, Input, Space, Modal, Descriptions } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


console.log("Doctors component loaded");

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [isDoctorInfoOpen, setIsDoctorInfoOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);


  const getDoctors = async () => {
    try {
      const res = await axios.get('/api/v1/admin/get_All_Doctors', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setDoctors(res.data.data);
        setFilteredDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //doctor info handler

  const handleDoctorInfo = (record) => {
    setSelectedDoctor(record);
    setIsDoctorInfoOpen(true);
  };


  const handleAccountUpdate = async (record, status) => {
    try {
      const res = await axios.post('/api/v1/admin/changes_Account_Status', {
        doctorId: record._id,
        userId: record.userId,
        status: status
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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


  const handleDeleteDoctor = async (record) => {
    try {
      const res = await axios.delete(
        `/api/v1/admin/delete-doctor/${record._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        getDoctors();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
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
      title: "Doctor Info",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleDoctorInfo(record)}
        >
          Doc Info
        </Button>
      ),
    },

    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button type='primary' onClick={() => handleAccountUpdate(record, 'approved')}>
                Approve
              </Button>
              <Button danger onClick={() => handleAccountUpdate(record, 'rejected')}>
                Reject
              </Button>
            </>
          )}

          {record.status === 'approved' && (
            <Button danger onClick={() => handleAccountUpdate(record, 'released')}>
              Release
            </Button>
          )}

          {record.status === 'released' && (
            <Button type='primary' onClick={() => handleAccountUpdate(record, 'approved')}>
              Renew
            </Button>
          )}

          <Button danger onClick={() => handleDeleteDoctor(record)}>
            Delete
          </Button>
        </Space>
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
      
      <Modal
        title="Doctor Information"
        open={isDoctorInfoOpen}
        onCancel={() => setIsDoctorInfoOpen(false)}
        footer={null}
        width={700}
      >
        {selectedDoctor && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {selectedDoctor.email}
            </Descriptions.Item>

            <Descriptions.Item label="Phone">
              {selectedDoctor.phone}
            </Descriptions.Item>

            <Descriptions.Item label="Address">
              {selectedDoctor.address}
            </Descriptions.Item>

            <Descriptions.Item label="Specialization">
              {selectedDoctor.specialization}
            </Descriptions.Item>

            <Descriptions.Item label="Experience">
              {selectedDoctor.experience} years
            </Descriptions.Item>

            <Descriptions.Item label="Fees">
              ₹{selectedDoctor.feesPerConsultation}
            </Descriptions.Item>

            {/* <Descriptions.Item label="Degree Certificate">
              {selectedDoctor.degreeCertificate ? (
                <a
                  href={`http://localhost:8080${selectedDoctor.degreeCertificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate
                </a>
              ) : (
                "Not Uploaded"
              )}
            </Descriptions.Item> */}

            <Descriptions.Item label="Degree Certificate">
              {selectedDoctor.degreeCertificate ? (
                <div style={{ width: "100%" }}>
                 
                  {/* Certificate Preview */}
            
                  <iframe
                    src={`http://localhost:8080/${selectedDoctor.degreeCertificate.replace(/^\/+/, "")}`}
                    title="Certificate"
                    style={{
                      width: "100%",
                      height: "350px",
                      border: "1px solid #ddd",
                      borderRadius: "10px"
                    }}
                  />

                </div>
              ) : (
                "Not Uploaded"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </Layout>
  );
};

export default Doctors;
