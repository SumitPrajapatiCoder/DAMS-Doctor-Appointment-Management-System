import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Row, Input, Modal, Button, Pagination, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DoctorList from '../components/DoctorList';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const Home_page = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state) => state.user);
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [currentPage, setCurrentPage] = useState(1);
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const doctorsPerPage = 3;

  const isNewUser = !user?.hasRoleStatus && !localStorage.getItem('role');

  const get_User_data = async () => {
    try {
      const res = await axios.get('/api/v1/user/get_all_doctor_list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    get_User_data();
  }, []);

  const handleRoleSelect = async (role) => {
    try {
      const res = await axios.put('/api/v1/user/setRole', { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.data.success) {
        localStorage.setItem('role', role);
        setUserRole(role);
        toast.success(res.data.message, { position: "top-right" });
      }
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error("Role not updated", { position: "top-right" });
    }
  };

  const handleSpecializationFilter = (value) => {
    setSpecializationFilter(value);
    setCurrentPage(1);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;

    return matchesName && matchesSpecialization;
  });

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const specializations = Array.from(new Set(doctors.map((doctor) => doctor.specialization)));

  return (
    <Layout>
      <h1 className='text-center'>Home Page</h1>

      <div className='search-bar' style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Input
          placeholder='Search by name or specialization...'
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: '300px', marginRight: '10px' }}
        />

        <Select
          value={specializationFilter}
          onChange={handleSpecializationFilter}
          style={{ width: 200 }}
        >
          <Option value="all">All Specializations</Option>
          {specializations.map((spec) => (
            <Option key={spec} value={spec}>
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </Option>
          ))}
        </Select>
      </div>

      <Row>
        {currentDoctors.length > 0 ? (
          currentDoctors.map((doctor) => <DoctorList key={doctor._id} doctor={doctor} />)
        ) : (
          <p className='text-center'>No doctors found.</p>
        )}
      </Row>

      {filteredDoctors.length > doctorsPerPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Pagination
            current={currentPage}
            pageSize={doctorsPerPage}
            total={filteredDoctors.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{ marginBottom: '20px' }}
          />
        </div>
      )}

      {isNewUser && (
        <Modal
          title={<h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>🌟 Select Your Role 🌟</h2>}
          open={isNewUser}
          footer={null}
          closable={false}
          bodyStyle={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '10px' }}
        >
          <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.8', marginBottom: '20px' }}>
            <strong style={{ color: '#4caf50' }}>Doctor:</strong> Complete the "Apply as Doctor" form from the sidebar.<br />
            <strong style={{ color: '#e63946' }}>Note:</strong> If you log out without filling the form, you’ll be treated as a <strong>Patient</strong>.<br />
            <strong style={{ color: '#ffa500' }}>Patient:</strong> No extra steps — start booking appointments instantly.<br />
          </p>


          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <Button
              type="default"
              size="large"
              style={{
                width: '45%',
                backgroundColor: '#4A90E2',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0px 0px 15px rgba(74, 144, 226, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => handleRoleSelect('patient')}
            >
              🧑‍🤝‍🧑 As Patient
            </Button>

            <Button
              type="primary"
              size="large"
              style={{
                width: '45%',
                backgroundColor: '#6A0DAD',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0px 0px 15px rgba(106, 13, 173, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
              }}
              onClick={() => handleRoleSelect('doctor')}
            >
              👨‍⚕️ As Doctor
            </Button>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default Home_page;