// import React, { useState, useEffect } from "react";
// import "../style/Layout_Style.css";
// import {
//     adminMenu,
//     applyAsDoctorMenu,
//     applyAsPatientMenu,
// } from "../Data/data";

// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import axios from "axios";

// const MySwal = withReactContent(Swal);

// const Layout = ({ children }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { user } = useSelector((state) => state.user);

//     const [showSidebar, setShowSidebar] = useState(false);
//     const [isPatientProfileCreated, setIsPatientProfileCreated] = useState(false);
//     const [loading, setLoading] = useState(true);

//     const showDrPrefix =
//         user?.isDoctor === true &&
//         user?.hasRoleStatus === "approved";

//     // ================= CHECK PATIENT PROFILE =================
//     useEffect(() => {
//         const fetchPatientProfile = async () => {
//             if (!user) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const res = await axios.get(
//                     `/api/v1/patient/profile/${user._id}`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem("token")}`,
//                         },
//                     }
//                 );

//                 if (res.data.success && res.data.patient) {
//                     setIsPatientProfileCreated(true);
//                 } else {
//                     setIsPatientProfileCreated(false);
//                 }
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPatientProfile();
//     }, [user]);

//     // ================= LOGOUT =================
//     const handle_log_out = async () => {
//         const result = await MySwal.fire({
//             title: "Are you sure?",
//             text: "Do you really want to log out?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes, Logout",
//         });

//         if (!result.isConfirmed) return;

//         localStorage.clear();
//         toast.success("Logout Successful!");
//         navigate("/landing");
//     };

//     // ================= MENUS =================
//     const doctorMenu = [
//         { name: "Home", path: "/" },
//         { name: "Appointments", path: "/doctor_appointment" },
//         { name: "Update Profile", path: `/doctor/profile/${user?._id}` },
//     ];

//     const patientMenu = [
//         { name: "Home", path: "/" },
//         {
//             name: isPatientProfileCreated ? "Update Profile" : "Create Profile",
//             path: isPatientProfileCreated
//                 ? `/patient/profile/${user?._id}`
//                 : "/apply_patient",
//         },
//         {
//             name: "My Appointments",
//             path: "/appointment",
//             icon: "fa-solid fa-calendar-check",
//         },
//     ];

//     let Slidebar = [];

//     if (user?.isAdmin) Slidebar = adminMenu;
//     else if (user?.isDoctor) Slidebar = doctorMenu;
//     else if (user?.isPatient || user?.hasRoleStatus === "patient")
//         Slidebar = patientMenu;
//     else if (user?.hasRoleStatus === "doctor")
//         Slidebar = [{ name: "Home", path: "/" }, applyAsDoctorMenu];
//     else
//         Slidebar = [
//             { name: "Home", path: "/" },
//             applyAsDoctorMenu,
//             applyAsPatientMenu,
//         ];

//     const profilePath = user?.isDoctor
//         ? `/doctor/profile/${user?._id}`
//         : user?.isPatient
//             ? `/patient/profile/${user?._id}`
//             : "/";

//     if (loading) return null; // clean loader

//     return (
//         <div className="main">
//             {/* HEADER */}
//             <header className="header">
//                 <div className="header_left">
//                     <i
//                         className="fa-solid fa-bars menu_toggle"
//                         onClick={() => setShowSidebar(true)}
//                     />
//                     <div className="app_brand">
//                         <img src="/logo192.png" alt="logo" className="brand_logo" />
//                         <span className="brand_text">ClinicVisit</span>
//                     </div>
//                 </div>

//                 <nav className="header_menu">
//                     {Slidebar.map((menu) => (
//                         <Link
//                             key={menu.path}
//                             to={menu.path}
//                             className={`header_link ${location.pathname === menu.path ? "active" : ""
//                                 }`}
//                         >
//                             {menu.name}
//                         </Link>
//                     ))}

//                     <Link to="/notification" className="header_link">
//                         Notifications ({user?.notification?.length || 0})
//                     </Link>

//                     <span className="header_link logout_text" onClick={handle_log_out}>
//                         Logout
//                     </span>
//                 </nav>

//                 <div className="header_right">

//                     <Link to={profilePath} className="userName">
//                         {showDrPrefix ? `Dr. ${user?.name}` : user?.name}
//                     </Link>

//                 </div>
//             </header>

//             {/* MOBILE SIDEBAR */}
//             <div
//                 className={`sidebar_overlay ${showSidebar ? "show" : ""}`}
//                 onClick={() => setShowSidebar(false)}
//             />

//             <aside className={`sidebar ${showSidebar ? "show" : ""}`}>
//                 <h6 className="sidebar_title">Menu</h6>
//                 {Slidebar.map((menu) => (
//                     <Link
//                         key={menu.path}
//                         to={menu.path}
//                         className="menu_item"
//                         onClick={() => setShowSidebar(false)}
//                     >
//                         {menu.name}
//                     </Link>
//                 ))}
//                 <div className="menu_item logout" onClick={handle_log_out}>
//                     Logout
//                 </div>
//             </aside>

//             {/* BODY */}
//             <div className="body">{children}</div>
//         </div>
//     );
// };

// export default Layout;





















import React, { useState, useEffect } from "react";
import "../style/Layout_Style.css";
import {
    adminMenu,
    applyAsDoctorMenu,
    applyAsPatientMenu,
} from "../Data/data";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.user);

    const [showSidebar, setShowSidebar] = useState(false);
    const [isPatientProfileCreated, setIsPatientProfileCreated] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ FIX 1: Doctor prefix logic (NO other logic changed)
    const showDrPrefix = user?.isDoctor === true;

    // ================= CHECK PATIENT PROFILE =================
    useEffect(() => {
        const fetchPatientProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(
                    `/api/v1/user/patient/profile/${user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (res.data.success && res.data.patient) {
                    setIsPatientProfileCreated(true);
                } else {
                    setIsPatientProfileCreated(false);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientProfile();
    }, [user]);

    // ================= LOGOUT =================
    const handle_log_out = async () => {
        const result = await MySwal.fire({
            title: "Are you sure?",
            text: "Do you really want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
        });

        if (!result.isConfirmed) return;

        localStorage.clear();
        toast.success("Logout Successful!");
        navigate("/landing");
    };

    // ================= MENUS =================
    const doctorMenu = [
        { name: "Home", path: "/" },
        { name: "Appointments", path: "/doctor_appointment" },
        { name: "Update Profile", path: `/doctor/profile/${user?._id}` },
    ];

    const patientMenu = [
        { name: "Home", path: "/" },
        {
            name: isPatientProfileCreated ? "Update Profile" : "Create Profile",
            path: isPatientProfileCreated
                ? `/patient/profile/${user?._id}`
                : "/apply_patient",
        },
        {
            name: "My Appointments",
            path: "/appointment",
            icon: "fa-solid fa-calendar-check",
        },
    ];

   
    let Slidebar = [];

    if (user?.isAdmin) {
        Slidebar = adminMenu;
    }

    else if (user?.isDoctor === true) {
        Slidebar = doctorMenu;
    }

    else if (user?.isPatient === true) {
        Slidebar = patientMenu;
    }

    else if (user?.hasRoleStatus === "doctor") {
        Slidebar = doctorMenu;
    }

    else if (user?.hasRoleStatus === "patient") {
        Slidebar = patientMenu;
    }

    else {
        Slidebar = [
            { name: "Home", path: "/" },
            applyAsDoctorMenu,
            applyAsPatientMenu,
        ];
    }

    const profilePath = user?.isDoctor
        ? `/doctor/profile/${user?._id}`
        : user?.isPatient
            ? `/patient/profile/${user?._id}`
            : "/";

    if (loading) return null;

    return (
        <div className="main">
            {/* HEADER */}
            <header className="header">
                <div className="header_left">
                    <i
                        className="fa-solid fa-bars menu_toggle"
                        onClick={() => setShowSidebar(true)}
                    />
                    <div className="app_brand">
                       
                        <span className="brand_text">🏥ClinicVisit</span>
                    </div>
                </div>

                <nav className="header_menu">
                    {Slidebar.map((menu) => (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`header_link ${
                                location.pathname === menu.path ? "active" : ""
                            }`}
                        >
                            {menu.name}
                        </Link>
                    ))}

                    <Link to="/notification" className="header_link">
                        Notifications ({user?.notification?.length || 0})
                    </Link>

                    <span className="header_link logout_text" onClick={handle_log_out}>
                        Logout
                    </span>
                </nav>

                <div className="header_right">
                    <Link to={profilePath} className="userName">
                        {(() => {
                            const showDrPrefix = user?.isDoctor === true && user?.isAdmin !== true;
                            return showDrPrefix ? `Dr. ${user?.name}` : user?.name;
                        })()}
                    </Link>
                </div>
            </header>

            {/* MOBILE SIDEBAR */}
            <div
                className={`sidebar_overlay ${showSidebar ? "show" : ""}`}
                onClick={() => setShowSidebar(false)}
            />

            <aside className={`sidebar ${showSidebar ? "show" : ""}`}>
                <h6 className="sidebar_title">Menu</h6>
                {Slidebar.map((menu) => (
                    <Link
                        key={menu.path}
                        to={menu.path}
                        className="menu_item"
                        onClick={() => setShowSidebar(false)}
                    >
                        {menu.name}
                    </Link>
                ))}
                <div className="menu_item logout" onClick={handle_log_out}>
                    Logout
                </div>
            </aside>

            {/* BODY */}
            <div className="body">{children}</div>
        </div>
    );
};

export default Layout;
