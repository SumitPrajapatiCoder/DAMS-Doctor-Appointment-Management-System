// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Layout from '../components/Layout';
// import { Row,Col, Input,  Pagination, Select } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
// import DoctorList from '../components/DoctorList';
// //import { useSelector } from 'react-redux';
// //import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../style/HomePage.css";



// function Home_page() {
//   const [doctors, setDoctors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   //const { user } = useSelector((state) => state.user);
//   //const [setUserRole] = useState(localStorage.getItem('role'));
//   const [currentPage, setCurrentPage] = useState(1);
//   const [specializationFilter, setSpecializationFilter] = useState('all');
//   const doctorsPerPage = 8;

//   //const isNewUser = !user?.hasRoleStatus && !localStorage.getItem('role');

//   const get_User_data = async () => {
//     try {
//       const res = await axios.get('/api/v1/user/get_all_doctor_list', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (res.data.success) setDoctors(res.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     get_User_data();
//   }, []);




//   const filteredDoctors = doctors.filter((doctor) => {
//     const matchesName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.address.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;

//     return matchesName && matchesSpecialization;
//   });

//   const indexOfLastDoctor = currentPage * doctorsPerPage;
//   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
//   const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

//   const specializations = Array.from(new Set(doctors.map((doctor) => doctor.specialization)));

//   return (
//     <Layout>


//       <h1 className="home-title">Available Doctors</h1>

//       <div className="home-search-bar">
//         <Input
//           className="home-search-input"
//           prefix={<SearchOutlined />}
//           placeholder="Search by name or specialization..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           } } />

//         <Select
//           className="home-search-select"
//           value={specializationFilter}
//           onChange={(value) => {
//             setSpecializationFilter(value);
//             setCurrentPage(1);
//           } }
//         >
//           <Select.Option value="all">All Specializations</Select.Option>
//           {specializations.map((spec) => (
//             <Select.Option key={spec} value={spec}>
//               {spec}
//             </Select.Option>
//           ))}
//         </Select>
//       </div>

//       <Row className="home-doctor-row" gutter={[24, 24]} justify="center">
//         {currentDoctors.length > 0 ? (
//           currentDoctors.map((doctor) => (
//             <Col
//               key={doctor._id}
//               xs={24}
//               sm={12}
//               md={12}
//               lg={6}
//               style={{ display: "flex", justifyContent: "center" }}
//             >
//               <DoctorList doctor={doctor} />
//             </Col>
//           ))
//         ) : (
//           <p className="home-no-data">No doctors found</p>
//         )}
//       </Row>

//       {filteredDoctors.length > doctorsPerPage && (
//         <div className="home-pagination">
//           <Pagination
//             current={currentPage}
//             pageSize={doctorsPerPage}
//             total={filteredDoctors.length}
//             onChange={(page) => setCurrentPage(page)}
//             showSizeChanger={false} />
//         </div>
//       )}
//     </Layout>
//   );
// }

// export default Home_page;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Row, Col, Input, Pagination, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DoctorList from '../components/DoctorList';
import "react-toastify/dist/ReactToastify.css";
import "../style/HomePage.css";

function Home_page() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const doctorsPerPage = 8;

  const get_User_data = async () => {
    try {
      const res = await axios.get('/api/v1/user/get_all_doctor_list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_User_data();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {

    const matchesName =
      `${doctor.firstName} ${doctor.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      specializationFilter === 'all' ||
      doctor.specialization === specializationFilter;

    return matchesName && matchesSpecialization;
  });

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const specializations = Array.from(
    new Set(doctors.map((doctor) => doctor.specialization))
  );

  return (
    <Layout>

      <h1 className="home-title">Available Doctors</h1>

      <div className="home-search-bar">

        <Input
          className="home-search-input"
          prefix={<SearchOutlined />}
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Select
          className="home-search-select"
          value={specializationFilter}
          onChange={(value) => {
            setSpecializationFilter(value);
            setCurrentPage(1);
          }}
        >
          <Select.Option value="all">
            All Specializations
          </Select.Option>

          {specializations.map((spec) => (
            <Select.Option key={spec} value={spec}>
              {spec}
            </Select.Option>
          ))}
        </Select>

      </div>

      {/* DOCTOR CARDS */}

      <Row
        className="home-doctor-row"
        gutter={[0, 24]}
        style={{ width: "100%", margin: 0 }}
        justify="center"
      >

        {currentDoctors.length > 0 ? (

          currentDoctors.map((doctor) => (

            <Col
              key={doctor._id}
              xs={24}
              sm={12}
              md={12}
              lg={6}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "0 12px"
              }}
            >

              <DoctorList doctor={doctor} />

            </Col>

          ))

        ) : (

          <p className="home-no-data">
            No doctors found
          </p>

        )}

      </Row>

      {/* PAGINATION */}

      {filteredDoctors.length > doctorsPerPage && (

        <div className="home-pagination">

          <Pagination
            current={currentPage}
            pageSize={doctorsPerPage}
            total={filteredDoctors.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />

        </div>

      )}

    </Layout>
  );
}

export default Home_page;