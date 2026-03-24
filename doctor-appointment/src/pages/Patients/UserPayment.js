import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../style/UserPayment.css";

const UserPayment = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [paymentType, setPaymentType] = useState(""); // online or offline
    const [onlineMethod, setOnlineMethod] = useState(""); // UPI, Netbanking, Card
    const [upiApp, setUpiApp] = useState("");
    const [bank, setBank] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await axios.get("/api/v1/user/user_Appointment", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const app = res.data.data.find(a => a._id === appointmentId);
                setAppointment(app);
            } catch {
                toast.error("Failed to load appointment");
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    const handlePay = async () => {
        if (!paymentType) {
            toast.warning("Please select payment type");
            return;
        }

        if (paymentType === "online" && !onlineMethod) {
            toast.warning("Please select an online payment method");
            return;
        }

        try {
            setIsLoading(true);

            const res = await axios.post(
                "/api/v1/payment/pay",
                {
                    appointmentId,
                    amount: appointment.doctorId.feesPerConsultation,
                    paymentMode: paymentType,
                    bankName: onlineMethod || "Cash",
                    transactionRef: "AUTO_GENERATED",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("Payment successful");
                navigate(`/receipt/${res.data.data._id}`);
            }
        } catch {
            toast.error("Payment failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!appointment) return <p style={{ textAlign: "center" }}>Loading...</p>;

    return (
        <Layout>
            <div className="payment-bg">
                <div className="payment-card">

                    <h2>
                        <i className="fa-solid fa-credit-card"></i> Choose Your Payment Method
                    </h2>

                    {/* Payment Type */}
                    <div className="payment-type">
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="online"
                                onChange={() => setPaymentType("online")}
                            />
                            Online Payment
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="offline"
                                onChange={() => setPaymentType("offline")}
                            />
                            Offline Payment
                        </label>
                    </div>

                    {/* ONLINE OPTIONS */}
                    {paymentType === "online" && (
                        <>
                            <div className="sub-options">
                                <label>Select Method:</label>
                                <select
                                    onChange={(e) => setOnlineMethod(e.target.value)}
                                >
                                    <option value="">Choose</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Netbanking">Netbanking</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>

                            {/* UPI */}
                            {onlineMethod === "UPI" && (
                                <div className="sub-options">
                                    <label>Select UPI App:</label>
                                    <select
                                        onChange={(e) => setUpiApp(e.target.value)}
                                    >
                                        <option>Google Pay</option>
                                        <option>PhonePe</option>
                                        <option>Paytm</option>
                                    </select>
                                </div>
                            )}

                            {/* Netbanking */}
                            {onlineMethod === "Netbanking" && (
                                <div className="sub-options">
                                    <label>Select Bank:</label>
                                    <select
                                        onChange={(e) => setBank(e.target.value)}
                                    >
                                        <option>SBI</option>
                                        <option>ICICI</option>
                                        <option>HDFC</option>
                                        <option>Axis Bank</option>
                                    </select>
                                </div>
                            )}

                            {/* Card */}
                            {onlineMethod === "Card" && (
                                <div className="sub-options">
                                    <label>Enter Card Number:</label>
                                    <input
                                        type="text"
                                        placeholder="XXXX-XXXX-XXXX-XXXX"
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <button
                        className="pay-btn"
                        onClick={handlePay}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Processing..."
                            : `Pay ₹${appointment.doctorId.feesPerConsultation}`}
                    </button>

                </div>
            </div>
        </Layout>
    );
};

export default UserPayment;
