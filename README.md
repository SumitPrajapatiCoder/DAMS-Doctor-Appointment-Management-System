# 🏥 Doctor Appointment Booking App 

This project is a full-stack web application that allows patients to book appointments with doctors online. It provides a platform for doctors to manage their profiles and schedules, and for administrators to oversee the entire system. The application aims to streamline the appointment booking process, making it more efficient and convenient for both patients and healthcare providers.

🚀 **Key Features**

*   **User Authentication:** Secure registration and login for patients, doctors, and administrators.
*   **Doctor Profiles:** Doctors can create and manage their profiles, including specialization, experience, and availability.
*   **Appointment Booking:** Patients can easily search for doctors and book appointments based on their availability.
*   **Admin Panel:** Administrators can manage users, doctors, and appointment statuses.
*   **Notifications:** Real-time notifications for appointment confirmations, cancellations, and updates.
*   **Role-Based Access Control:** Different user roles (patient, doctor, admin) have different levels of access and permissions.
*   **Loading Indicators:** Display loading indicators to improve user experience during data fetching.
*   **Profile Updates:** Users and doctors can update their profile information.

🛠️ **Tech Stack**

*   **Frontend:**
    *   React
    *   Redux Toolkit
    *   React Router DOM
    *   Ant Design
    *   Axios
    *   React Toastify
*   **Backend:**
    *   Node.js
    *   Express.js
*   **Database:**
    *   MongoDB
    *   Mongoose
*   **Authentication:**
    *   JSON Web Tokens (JWT)
    *   bcryptjs
*   **Middleware:**
    *   cors
    *   morgan
*   **Other:**
    *   dotenv
    *   colors
    *   dayjs

📦 **Getting Started / Setup Instructions**

**Prerequisites**

*   Node.js and npm installed
*   MongoDB installed and running
*   A code editor (e.g., VS Code)

**Installation**

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd doctor-appointment
    npm install
    ```

4.  **Configure environment variables:**

    *   Create a `.env` file in the `backend` directory.
    *   Add the following environment variables:

        ```
        MONGODB_URL=<your_mongodb_connection_string>
        PORT=<port_number> (e.g., 8080)
        JWT_SECRET=<your_jwt_secret>
        ```

**Running Locally**

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**
    ```bash
    cd doctor-appointment
    npm start
    ```

3.  **Open the application in your browser:**
    `http://localhost:3000` (or the port specified in your frontend configuration)

📂 **Project Structure**

```
├── backend/
│   ├── configure/
│   │   └── mongodb.js
│   ├── controller/
│   │   ├── adminControl.js
│   │   ├── doctor.Control.js
│   │   └── userControl.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── appointmentModel.js
│   │   ├── doctorModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── adminRoute.js
│   │   ├── doctorRoute.js
│   │   └── userRoute.js
│   ├── server.js
│   └── package.json
├── doctor-appointment/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DoctorList.js
│   │   │   ├── Layout.js
│   │   │   ├── ProtectRoute.js
│   │   │   ├── PublicRoute.js
│   │   │   └── Spinner.js
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── Doctors.js
│   │   │   │   └── Users.js
│   │   │   ├── Doctor/
│   │   │   │   ├── DoctorAppointmentList.js
│   │   │   │   └── Profile.js
│   │   │   ├── AppointmentList.js
│   │   │   ├── BookingPage.js
│   │   │   ├── Home_page.js
│   │   │   ├── Login.js
│   │   │   ├── Notification.js
│   │   │   └── Register.js
│   │   ├── Redux/
│   │   │   ├── features/
│   │   │   │   ├── alertSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── store.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
├── .gitignore
└── README.md
```

📸 **Screenshots**

*(Add screenshots of the application here)*
<img width="1340" height="603" alt="image" src="https://github.com/user-attachments/assets/3ae3dd9d-f0a5-4cf5-b4a2-0316aa987970" />
<img width="1114" height="479" alt="image" src="https://github.com/user-attachments/assets/bd412f3c-a059-4ee0-b047-f24e4bf998fe" />
<img width="1122" height="590" alt="image" src="https://github.com/user-attachments/assets/166f28cd-e53b-42d7-af8f-6340b9665fb3" />
<img width="1355" height="593" alt="image" src="https://github.com/user-attachments/assets/23db0b9b-60ee-4fb0-97b4-4e2d9ad1d768" />
<img width="1348" height="602" alt="image" src="https://github.com/user-attachments/assets/a5324fc2-4cf6-4853-8942-4ceba4748374" />
<img width="1110" height="595" alt="image" src="https://github.com/user-attachments/assets/96af7cbd-4a84-45a4-b0f8-2a714d862c20" />
<img width="1109" height="335" alt="image" src="https://github.com/user-attachments/assets/1b83fd57-4b98-4e83-967e-acccaa580079" />
<img width="1116" height="375" alt="image" src="https://github.com/user-attachments/assets/51d6afcc-b526-452f-bdec-15328e904887" />
<img width="1117" height="353" alt="image" src="https://github.com/user-attachments/assets/feea99d3-f23a-48c7-ace7-973d32ec1424" />
<img width="1116" height="373" alt="image" src="https://github.com/user-attachments/assets/d300b917-378d-4225-b42e-a280835915a7" />
<img width="1112" height="352" alt="image" src="https://github.com/user-attachments/assets/926cd79a-282a-44c4-8a30-b297e97a5bca" />

