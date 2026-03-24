// import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout";
// import {
//     Col,
//     Form,
//     Input,
//     Row,
//     Upload,
//     Button,
//     Select,
//     InputNumber,
//     Spin
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import "../../style/applyPatient.css";

// const { Option } = Select;
// const BASE_URL = "http://localhost:8080";

// const ApplyPatient = () => {
//     const { user } = useSelector((state) => state.user);
//     const [form] = Form.useForm();

//     const [imageUrl, setImageUrl] = useState("");
//     const [medicalFile, setMedicalFile] = useState("");
//     const [isProfileCreated, setIsProfileCreated] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [submitLoading, setSubmitLoading] = useState(false);

//     // ================= FETCH PROFILE =================
//     const fetchProfile = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(
//                 `/api/v1/user/patient/profile/${user._id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             if (res.data.success && res.data.patient) {
//                 const p = res.data.patient;

//                 setIsProfileCreated(true);
//                 setImageUrl(p.image || "");
//                 setMedicalFile(p.medicalHistoryFile || "");

//                 form.setFieldsValue({
//                     firstName: p.firstName,
//                     lastName: p.lastName,
//                     phone: p.phone,
//                     email: p.email || user.email,
//                     gender: p.gender,
//                     age: Number(p.age),
//                     address: p.address,
//                     bloodGroup: p.bloodGroup,
//                     height: p.height ? Number(p.height) : undefined,
//                     weight: p.weight ? Number(p.weight) : undefined,
//                     medicalHistory: p.medicalHistory,
//                     allergies: p.allergies,
//                     emergencyContact: p.emergencyContact,
//                 });
//             } else {
//                 // CREATE MODE
//                 setIsProfileCreated(false);
//                 form.resetFields();
//                 form.setFieldValue("email", user.email);
//                 setImageUrl("");
//                 setMedicalFile("");
//             }
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (user?._id) fetchProfile();
//         // eslint-disable-next-line
//     }, [user?._id]);

//     // ================= SUBMIT =================
//     const handleSubmit = async (values) => {
//         try {
//             setSubmitLoading(true);

//             const payload = {
//                 ...values,
//                 userId: user._id,
//                 email: user.email,
//                 image: imageUrl || "",
//                 medicalHistoryFile: medicalFile || "",
//             };

//             const apiUrl = isProfileCreated
//                 ? `/api/v1/user/patient/update/${user._id}`
//                 : "/api/v1/user/apply_patient";

//             const res = await axios.post(apiUrl, payload, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             if (res.data.success) {
//                 toast.success(
//                     isProfileCreated
//                         ? "Profile updated successfully"
//                         : "Profile created successfully"
//                 );

//                 if (!isProfileCreated) {
//                     const updatedUser = { ...user, isPatient: true, hasRoleStatus: "patient" };

//                     // Update localStorage
//                     localStorage.setItem("user", JSON.stringify(updatedUser));

//                     // Update Redux state
//                     window.dispatchEvent(new Event("storage")); // force Layout to detect change
//                 }

//                 fetchProfile();
            

//             } else {
//                 toast.error(res.data.message || "Action failed");
//             }
//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data?.message || "Server error");
//         } finally {
//             setSubmitLoading(false);
//         }
//     };

//     // ================= UPLOAD HANDLERS =================
//     const uploadImage = async ({ file, onSuccess, onError }) => {
//         try {
//             const fd = new FormData();
//             fd.append("image", file);

//             const res = await axios.post("/api/v1/user/uploadPhoto", fd, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             setImageUrl(res.data.path);
//             toast.success("Profile photo uploaded");
//             onSuccess("ok");
//         } catch (err) {
//             onError(err);
//         }
//     };

//     const uploadMedicalFile = async ({ file, onSuccess, onError }) => {
//         try {
//             const fd = new FormData();
//             fd.append("medicalFile", file);

//             const res = await axios.post("/api/v1/user/uploadMedicalFile", fd, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             setMedicalFile(res.data.path);
//             toast.success("Medical document uploaded");
//             onSuccess("ok");
//         } catch (err) {
//             onError(err);
//         }
//     };

//     if (loading) {
//         return (
//             <Layout>
//                 <div className="text-center mt-5">
//                     <Spin size="large" />
//                 </div>
//             </Layout>
//         );
//     }

//     return (
//         <Layout>
//             <h2 className="text-center mb-3">
//                 {isProfileCreated ? "Update Patient Profile" : "Create Patient Profile"}
//             </h2>

//             <Form
//                 layout="vertical"
//                 form={form}
//                 onFinish={handleSubmit}
//                 className="m-3"
//             >
//                 <Row gutter={20}>
//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item
//                             name="phone"
//                             label="Phone"
//                             rules={[
//                                 { required: true },
//                                 { pattern: /^[0-9]{10}$/, message: "Enter valid 10 digit number" },
//                             ]}
//                         >
//                             <Input maxLength={10} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="email" label="Email">
//                             <Input disabled />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
//                             <Select>
//                                 <Option value="Male">Male</Option>
//                                 <Option value="Female">Female</Option>
//                                 <Option value="Other">Other</Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="age" label="Age" rules={[{ required: true }]}>
//                             <InputNumber min={1} max={120} style={{ width: "100%" }} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24}>
//                         <Form.Item name="address" label="Address" rules={[{ required: true }]}>
//                             <Input.TextArea rows={2} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="bloodGroup" label="Blood Group" rules={[{ required: true }]}>
//                             <Select>
//                                 {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
//                                     <Option key={bg} value={bg}>{bg}</Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="height" label="Height (cm)">
//                             <InputNumber style={{ width: "100%" }} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12} lg={8}>
//                         <Form.Item name="weight" label="Weight (kg)">
//                             <InputNumber style={{ width: "100%" }} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12}>
//                         <Form.Item name="medicalHistory" label="Medical History">
//                             <Input.TextArea rows={3} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24} md={12}>
//                         <Form.Item name="allergies" label="Allergies">
//                             <Input.TextArea rows={3} />
//                         </Form.Item>
//                     </Col>

//                     <Col xs={24}>
//                         <Form.Item name="emergencyContact" label="Emergency Contact" rules={[{ required: true }]}>
//                             <Input />
//                         </Form.Item>
//                     </Col>

//                     {/* PROFILE IMAGE */}
//                     <Col xs={24}>
//                         <Upload showUploadList={false} customRequest={uploadImage}>
//                             <Button icon={<UploadOutlined />}>Upload Profile Photo</Button>
//                         </Upload>

//                         {imageUrl && (
//                             <img
//                                 src={`${BASE_URL}${imageUrl}`}
//                                 alt="profile"
//                                 style={{ width: 100, height: 100, borderRadius: "50%", marginTop: 10 }}
//                             />
//                         )}
//                     </Col>

//                     {/* MEDICAL FILE */}
//                     <Col xs={24}>
//                         <Upload showUploadList={false} accept=".pdf,.jpg,.png" customRequest={uploadMedicalFile}>
//                             <Button icon={<UploadOutlined />}>Upload Medical Document</Button>
//                         </Upload>

//                         {medicalFile && (
//                             <p style={{ marginTop: 8 }}>
//                                 <a href={`${BASE_URL}${medicalFile}`} target="_blank" rel="noreferrer">
//                                     View Uploaded File
//                                 </a>
//                             </p>
//                         )}
//                     </Col>
//                 </Row>

//                 <Button
//                     type="primary"
//                     htmlType="submit"
//                     loading={submitLoading}
//                     className="mt-4"
//                 >
//                     {isProfileCreated ? "Update Profile" : "Update Profile"}
//                 </Button>
//             </Form>
//         </Layout>
//     );
// };

// export default ApplyPatient;


































import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
    Col,
    Form,
    Input,
    Row,
    Upload,
    Button,
    Select,
    InputNumber,
    Spin,
    Card
} from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../style/applyPatient.css";

const { Option } = Select;
const BASE_URL = "http://localhost:8080";

const ApplyPatient = () => {
    const { user } = useSelector((state) => state.user);
    const [form] = Form.useForm();

    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [medicalFile, setMedicalFile] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    // ================= FETCH PROFILE =================
    const fetchProfile = async () => {
        setLoading(true);
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
                const p = res.data.patient;
                setProfile(p);
                setImageUrl(p.image || "");
                setMedicalFile(p.medicalHistoryFile || "");

                form.setFieldsValue({
                    ...p,
                    age: Number(p.age),
                    height: p.height ? Number(p.height) : undefined,
                    weight: p.weight ? Number(p.weight) : undefined,
                });
            } else {
                setEditMode(true); // create profile
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) fetchProfile();
    }, [user?._id]);

    // ================= SUBMIT =================
    // const handleSubmit = async (values) => {
    //     try {
    //         setSubmitLoading(true);

    //         const payload = {
    //             ...values,
    //             userId: user._id,
    //             email: user.email,
    //             image: imageUrl,
    //             medicalHistoryFile: medicalFile,
    //         };

    //         const res = await axios.post(
    //             `/api/v1/user/patient/update/${user._id}`,
    //             payload,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             }
    //         );

    //         if (res.data.success) {
    //             toast.success("Profile updated successfully");
    //             setEditMode(false);
    //             fetchProfile();
    //         } else {
    //             toast.error("Update failed");
    //         }
    //     } catch (err) {
    //         toast.error("Server error");
    //     } finally {
    //         setSubmitLoading(false);
    //     }
    // };
    
const handleSubmit = async (values) => {
    try {
        setSubmitLoading(true);

        const payload = {
            ...values,
            userId: user._id,
            email: user.email,
            image: imageUrl,
            medicalHistoryFile: medicalFile,
        };

        const url = profile
            ? `/api/v1/user/patient/update/${user._id}`   // UPDATE
            : `/api/v1/user/apply_patient`;               // CREATE

        const res = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (res.data.success) {
            toast.success(
                profile
                    ? "Profile updated successfully"
                    : "Profile created successfully"
            );
            setEditMode(false);
            fetchProfile();
        } else {
            toast.error("Operation failed");
        }
    } catch (err)  {
  console.error(err.response?.data || err.message);
  toast.error(err.response?.data?.message || "Server error");
}
 finally {
        setSubmitLoading(false);
    }
};


    // ================= UPLOAD =================
    const uploadImage = async ({ file, onSuccess }) => {
        const fd = new FormData();
        fd.append("image", file);
        const res = await axios.post("/api/v1/user/uploadPhoto", fd, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setImageUrl(res.data.path);
        onSuccess("ok");
    };

    const uploadMedicalFile = async ({ file, onSuccess }) => {
        const fd = new FormData();
        fd.append("medicalFile", file);
        const res = await axios.post("/api/v1/user/uploadMedicalFile", fd, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setMedicalFile(res.data.path);
        onSuccess("ok");
    };

    if (loading) {
        return (
            <Layout>
                <div className="center-spin">
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* ================= VIEW MODE ================= */}
            {!editMode && profile && (
                <div className="profile-view">
                    <Card className="profile-card">
                        <img
                            src={`${BASE_URL}${profile.image}`}
                            className="profile-avatar"
                            alt="profile"
                        />

                        <h2>
                            {profile.firstName} {profile.lastName}
                        </h2>

                        <div className="profile-info">
                            <p><b>Email:</b> {profile.email}</p>
                            <p><b>Phone:</b> {profile.phone}</p>
                            <p><b>Gender:</b> {profile.gender}</p>
                            <p><b>Age:</b> {profile.age}</p>
                            <p><b>Blood Group:</b> {profile.bloodGroup}</p>
                            <p><b>Height:</b> {profile.height} cm</p>
                            <p><b>Weight:</b> {profile.weight} kg</p>
                            <p><b>Medical History:</b> {profile.medicalHistory}</p>
                            <p><b>Allergies:</b> {profile.allergies}</p>
                            <p><b>Emergency Contact:</b> {profile.emergencyContact}</p>
                        </div>

                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </Button>
                    </Card>
                </div>
            )}

            {/* ================= FULL EDIT FORM ================= */}
            {editMode && (
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                    className="profile-form"
                >
                    <Row gutter={20}>
                        <Col md={8} xs={24}>
                            <Form.Item name="firstName" label="First Name" required>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="lastName" label="Last Name" required>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="phone" label="Phone" required>
                                <Input maxLength={10} />
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="email" label="Email">
                                <Input disabled />
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="gender" label="Gender" required>
                                <Select>
                                    <Option value="Male">Male</Option>
                                    <Option value="Female">Female</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="age" label="Age" required>
                                <InputNumber min={1} max={120} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item name="address" label="Address" required>
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="bloodGroup" label="Blood Group" required>
                                <Select>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                        <Option key={bg} value={bg}>{bg}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="height" label="Height (cm)">
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                            <Form.Item name="weight" label="Weight (kg)">
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col md={12} xs={24}>
                            <Form.Item name="medicalHistory" label="Medical History">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>

                        <Col md={12} xs={24}>
                            <Form.Item name="allergies" label="Allergies">
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item name="emergencyContact" label="Emergency Contact" required>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Upload showUploadList={false} customRequest={uploadImage}>
                                <Button icon={<UploadOutlined />}>Upload Profile Photo</Button>
                            </Upload>
                        </Col>

                        <Col xs={24}>
                            <Upload showUploadList={false} customRequest={uploadMedicalFile}>
                                <Button icon={<UploadOutlined />}>Upload Medical Document</Button>
                            </Upload>
                        </Col>
                    </Row>

                    <div className="form-actions">
                        <Button onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoading}
                        >
                            Save Profile
                        </Button>
                    </div>
                </Form>
            )}
        </Layout>
    );
};

export default ApplyPatient;
