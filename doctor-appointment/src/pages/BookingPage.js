import React, { useEffect, useState, useCallback } from 'react';
import Layout from './../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../Redux/features/alertSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../style/BookingPage.css";


const MySwal = withReactContent(Swal);

const BookingPage = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState(null);
    const params = useParams();
    const [slots, setSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingDoctor, setLoadingDoctor] = useState(true);

    const generateDateOptions = () => {
        let dates = [];
        for (let i = 0; i < 5; i++) {
            dates.push(dayjs().add(i, 'day').format('DD-MM-YYYY'));
        }
        return dates;
    };

    const dateOptions = generateDateOptions();

    const [selectedDate, setSelectedDate] = useState(
        localStorage.getItem('selectedDate') || dateOptions[0]
    );

    useEffect(() => {
        localStorage.setItem('selectedDate', selectedDate);
    }, [selectedDate]);

    // ================= FETCH DOCTOR =================
    const fetchDoctorData = useCallback(async () => {
        try {
            setLoadingDoctor(true);
            const res = await axios.post(
                "/api/v1/doctor/get_Doctor_By_Id",
                { doctorId: params.doctorId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingDoctor(false);
        }
    }, [params.doctorId]);

    // ================= FETCH BOOKED SLOTS =================
    const fetchBookedSlots = useCallback(async () => {
        try {
            const res = await axios.post(
                '/api/v1/user/get_booked_Slot',
                { doctorId: params.doctorId, date: selectedDate },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (res.data.success) {
                setBookedSlots(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }, [params.doctorId, selectedDate]);

    // ================= GENERATE TIME SLOTS =================
    const generateTimeSlots = useCallback(() => {
        if (!doctor || !doctor.timings) return;

        const [start, end] = doctor.timings;
        let slotList = [];
        let currentTime = dayjs(start, 'HH:mm');
        const endTime = dayjs(end, 'HH:mm');
        const today = dayjs().format('DD-MM-YYYY');
        const now = dayjs();

        while (currentTime.isBefore(endTime)) {
            if (selectedDate !== today || currentTime.isAfter(now)) {
                slotList.push(currentTime.format('HH:mm'));
            }
            currentTime = currentTime.add(1, 'hour');
        }

        setSlots(slotList);
    }, [doctor, selectedDate]);

    // ================= BOOK APPOINTMENT =================
    const handleBooking = async (time) => {
        const result = await MySwal.fire({
            title: "Confirm Appointment",
            html: `
            <p><strong>Date:</strong> ${selectedDate}</p>
            <p><strong>Time:</strong> ${time}</p>
        `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0edb18",
            cancelButtonColor: "#d63031",
            confirmButtonText: "Yes, Book Appointment",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            dispatch(showLoading());
            const res = await axios.post(
                '/api/v1/user/book-appointment',
                {
                    doctorId: params.doctorId,
                    userId: user._id,
                    doctorInfo: doctor,
                    userInfo: user,
                    date: selectedDate,
                    time,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            dispatch(hideLoading());

            if (res.data.success) {
                toast.success(res.data.message);
                setSelectedSlot(time);
                fetchBookedSlots();
            } else {
                toast.error(res.data.message || "Booking failed");
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Failed to book appointment");
        }
    };

    // ================= USE EFFECTS =================
    useEffect(() => {
        fetchDoctorData();
    }, [fetchDoctorData]);

    useEffect(() => {
        if (doctor && doctor.timings) {
            generateTimeSlots();
            fetchBookedSlots();
        }
    }, [doctor, selectedDate, generateTimeSlots, fetchBookedSlots]);

    const getSlotClass = (slot) => {
        const bookedSlot = bookedSlots.find((s) => s.time === slot);
        if (!bookedSlot) return 'btn-success';
        if (bookedSlot.status === 'approved') return 'btn-danger';
        if (bookedSlot.status === 'pending') return 'btn-warning';
        if (bookedSlot.status === 'rejected') return 'btn-secondary';
        return 'btn-success';
    };

    return (
        <Layout>
            <div className="booking-wrapper">

                <h3 className="booking-title text-center">
                    Book Appointment
                </h3>

                <div className="booking-card">

                    {/* Doctor Header */}
                    <div className="doctor-section">
                        <div className="doctor-avatar">👨‍⚕️</div>

                        <div className="doctor-details">
                            <h4>
                                Dr. {doctor?.firstName} {doctor?.lastName}
                            </h4>
                            <span className="doctor-specialization">
                                {doctor?.specialization}
                            </span>
                            <p className="doctor-address">{doctor?.address}</p>
                            <p className="doctor-fee">
                                Fees: ₹ {doctor?.feesPerConsultation}
                            </p>
                            <p className="doctor-timing">
                                Available: {doctor?.timings?.[0]} – {doctor?.timings?.[1]}
                            </p>
                        </div>
                    </div>

                    {/* Selected Slot */}
                    {selectedSlot && (
                        <div className="selected-slot">
                            Selected Slot: {selectedDate} at {selectedSlot}
                        </div>
                    )}

                    {/* Legend */}
                    <div className="slot-legend">
                        <span className="legend free">Free</span>
                        <span className="legend approved">Booked</span>
                        <span className="legend pending">Pending</span>
                        <span className="legend rejected">Rejected</span>
                    </div>

                    {/* Date Selection */}
                    <div className="date-section">
                        {dateOptions.map((date, index) => (
                            <button
                                key={index}
                                className={`date-btn ${date === selectedDate ? "active-date" : ""
                                    }`}
                                onClick={() => setSelectedDate(date)}
                            >
                                {dayjs(date, "DD-MM-YYYY").format("ddd, DD MMM")}
                                {index === 0 && <span className="today-tag">Today</span>}
                            </button>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <div className="time-grid">
                        {slots.length > 0 ? (
                            slots.map((slot, index) => (
                                <button
                                    key={index}
                                    className={`time-btn ${getSlotClass(slot)} ${selectedSlot === slot ? "active-slot" : ""
                                        }`}
                                    disabled={bookedSlots.some(
                                        (s) => s.time === slot && s.status === "approved"
                                    )}
                                    onClick={() =>
                                        !bookedSlots.some(
                                            (s) => s.time === slot && s.status === "approved"
                                        ) && handleBooking(slot)
                                    }
                                >
                                    {slot}
                                </button>
                            ))
                        ) : (
                            <div className="no-slots">
                                No slots available for this date.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default BookingPage;
