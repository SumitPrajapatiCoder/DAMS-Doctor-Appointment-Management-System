import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../style/LandingStyle.css";


const LandingPage = () => {
   

    return (
        
        <div className="landing-container">

            {/* Navbar */}
            <nav className="navbar">
                <h2 className="logo">🏥 ClinicVisit</h2>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>

            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-text">
                    <h1>World-Class Healthcare For Your Family</h1>
                    <p>
                        Trusted doctors, modern facilities & 24/7 emergency care — all in one place.
                    </p>

                    <Link to="/login" className="hero-btn">
                        Book Appointment
                    </Link>
                </div>

                <img
                    src="https://www.shutterstock.com/image-photo/medical-worker-using-tablet-touching-600nw-2502107587.jpg"
                    // src="DAMS-Doctor-Appointment-Management-System\doctor-appointment\src\Photo\doctorPhoto.JPG"
                    className="hero-img"
                    alt="Hospital"
                />
            </section>

            {/* Services Section */}
            <section className="services-section">
                <h2>Our Medical Services</h2>

                <div className="services-grid">
                    <div className="service-card">
                        <div className="icon">🩺</div>
                        <h3>General Checkup</h3>
                        <p>Complete health examination & medical analysis.</p>
                    </div>

                    <div className="service-card">
                        <div className="icon">👨‍⚕️</div>
                        <h3>Expert Consultation</h3>
                        <p>Consult with top doctors & specialists.</p>
                    </div>

                    <div className="service-card">
                        <div className="icon">🚑</div>
                        <h3>Emergency Care</h3>
                        <p>24/7 ambulance and emergency treatment.</p>
                    </div>

                    <div className="service-card">
                        <div className="icon"> 👨‍⚕️</div>
                        <h3>Doctor's Appointment Booking </h3>
                        <p>Schedule appointments with our expert doctors easily.</p>
                    </div>
                </div>
            </section>
            
            {/* Doctors Section */}

            <section className="doctors-section">
                <h2>Meet Our Specialists</h2>

                <div className="doctors-grid">

                    {[
                        {
                            id: 1,
                            name: "Dr. Sapana Prajapati",
                            speciality: "Cardiologist",
                            img: "https://img.freepik.com/free-vector/hand-drawn-iranian-women-illustration_23-2149825684.jpg?semt=ais_hybrid&w=740&q=80"
                        },
                        {
                            id: 2,
                            name: "Dr. Snehal Vertak",
                            speciality: "Dermatologist",
                            img: "https://img.freepik.com/free-vector/hand-drawn-iranian-women-illustration_23-2149825684.jpg?semt=ais_hybrid&w=740&q=80"
                        },
                        {
                            id: 3,
                            name: "Dr. Sumit Prajapati",
                            speciality: "Neurologist",
                            img: "https://t3.ftcdn.net/jpg/06/21/93/56/360_F_621935641_6ccjJFgTOFmm6MRK4iN19uTIhq4WGlWV.jpg"
                        }
                    ].map((doc) => (
                        <div className="doctor-card" key={doc.id}>
                            <img src={doc.img} alt={doc.name} />
                            <h3>{doc.name}</h3>
                            <p>{doc.speciality}</p>
                        </div>
                    ))}

                </div>
            </section>

            {/* Symptom Slider Section */}
    



            {/* Health Guides / Symptom Checker Section */}
            <section className="health-section">
                <h2>Check Symptoms and Take Appointment</h2>

                <div className="health-grid">

                    {[
                        {
                            id: 1,
                            title: "Chest Pain & Breathing Issues",
                            desc: "If you feel chest discomfort, pressure, or shortness of breath, it may require immediate attention.",
                            specialist: "Cardiologist",
                            img: "https://images.medicinenet.com/images/article/main_image/asthma-attack-shortness-breath-chest-pain-lungs-inhalation.jpg?output-quality=75"
                        },
                        {
                            id: 2,
                            title: "Skin Rashes & Allergies",
                            desc: "Redness, itching, dryness, or unknown allergies on the skin may need medical diagnosis.",
                            specialist: "Dermatologist",
                            img: "https://foodallergiesatlanta.com/wp-content/uploads/2019/10/food-allergy-hives-skin-rashes.jpg"
                        },
                        {
                            id: 3,
                            title: "Headache & Dizziness",
                            desc: "Frequent headaches, migraines, or dizziness might indicate a neurological condition.",
                            specialist: "Neurologist",
                            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDFcK6d79k_5maFoWA4LdoEf5xltIAv7LunQ&s"
                        },
                        {
                            id: 4,
                            title: "Vision Problems",
                            desc: "Issues related to vision, eye pain, or discomfort may require an ophthalmologist's attention.",
                            specialist: "Ophthalmology",
                            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDFcK6d79k_5maFoWA4LdoEf5xltIAv7LunQ&s"
                        }
                        // {
                        //     id: 5,
                        //     title: "Women's Health Issues",
                        //     desc: "Concerns related to pregnancy, menstruation, or menopause require specialized care.",
                        //     specialist:"Gynecologist",
                        //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDFcK6d79k_5maFoWA4LdoEf5xltIAv7LunQ&s"
                        // }
                    ].map((item) => (
                        <div className="health-card" key={item.id}>
                            <img className="health-img" src={item.img} alt={item.title} />

                            <div className="health-content">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <strong>Recommended Specialist: {item.specialist}</strong>

                                <Link to="/login" className="health-btn">
                                    Take Appointment Now
                                </Link>
                            </div>
                        </div>
                    ))}

                </div>
            </section>



            {/* Testimonials */}
            <section className="testimonials-section">
                <h2>What Patients Say</h2>

                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p>"Excellent service and friendly doctors! Highly recommended."</p>
                        <h4>— Patient</h4>
                    </div>

                    <div className="testimonial-card">
                        <p>"Quick appointments and very clean environment. Best hospital experience."</p>
                        <h4>— Patient</h4>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>📍 Mumbai, India</p>
                    <p>📞 +91 98765 43210</p>
                    <p>📧 support@clinicvisit.com</p>
                </div>

                © {new Date().getFullYear()} ClinicVisit Hospital — All Rights Reserved
            </footer>
        </div>
    );
};

export default LandingPage;
