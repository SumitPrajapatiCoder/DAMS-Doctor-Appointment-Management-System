import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../style/Receipt.css";

const Receipt = () => {
    const { transactionId } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        axios.get(`/api/v1/payment/receipt/${transactionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(res => setReceipt(res.data.data));
    }, [transactionId]);

    const downloadReceipt = () => {
        const printWindow = window.open("", "PRINT", "height=650,width=900,top=100,left=100");
        printWindow.document.write("<html><head><title>Receipt</title></head><body>");
        printWindow.document.write(document.getElementById("receipt").innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    if (!receipt) return <p>Loading...</p>;

    return (
        <Layout>
            <div className="receipt-bg">
                <div className="receipt-card" id="receipt">
                    <div className="success-emoji">🎉</div>
                    <h2>Payment Successful!</h2>

                    <div className="receipt-row"><b>Patient:</b> {receipt.userId.name}</div>
                    <div className="receipt-row"><b>Doctor:</b> {receipt.doctorId.firstName} {receipt.doctorId.lastName}</div>
                    <div className="receipt-row">
                        <b>Appointment Date & Time:</b> {receipt.appointmentId?.date} {receipt.appointmentId?.time}
                    </div>
                    <div className="receipt-row"><b>Amount:</b> ₹{receipt.amount}</div>
                    <div className="receipt-row"><b>Mode:</b> {receipt.paymentMode}</div>
                    <div className="receipt-row"><b>Status:</b> PAID</div>

                    <div className="receipt-actions">
                        <button className="receipt-btn" onClick={downloadReceipt}>Print / Save</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Receipt;
