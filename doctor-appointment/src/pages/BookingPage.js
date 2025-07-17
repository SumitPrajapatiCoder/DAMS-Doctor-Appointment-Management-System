
import React, { useEffect, useState } from 'react';
import Layout from './../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../Redux/features/alertSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPage = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [doctor, setDoctor] = useState({});
    const params = useParams();
    const [slots, setSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const generateDateOptions = () => {
        let dates = [];
        for (let i = 0; i < 5; i++) {
            const dateOption = dayjs().add(i, 'day').format('DD-MM-YYYY');
            dates.push(dateOption);
        }
        return dates;
    };

    const dateOptions = generateDateOptions();
    const [selectedDate, setSelectedDate] = useState(localStorage.getItem('selectedDate') || dateOptions[0]);

    useEffect(() => {
        localStorage.setItem('selectedDate', selectedDate);
    }, [selectedDate]);

    const fetchDoctorData = async () => {
        try {
            const res = await axios.post("/api/v1/doctor/get_Doctor_By_Id", { doctorId: params.doctorId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (res.data.success) setDoctor(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBookedSlots = async () => {
        try {
            const res = await axios.post('/api/v1/user/get_booked_Slot', {
                doctorId: params.doctorId,
                date: selectedDate
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (res.data.success) setBookedSlots(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const generateTimeSlots = () => {
        if (!doctor.timings) return [];

        const [start, end] = doctor.timings;
        let slotList = [];
        let currentTime = dayjs(start, 'HH:mm');
        const endTime = dayjs(end, 'HH:mm');
        const today = dayjs().format('DD-MM-YYYY');
        const now = dayjs();

        while (currentTime.isBefore(endTime)) {
            // Only include future time slots if the selected date is today
            if (selectedDate !== today || currentTime.isAfter(now)) {
                slotList.push(currentTime.format('HH:mm'));
            }
            currentTime = currentTime.add(1, 'hour');
        }

        setSlots(slotList);
    };

    const handleBooking = async (time) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/book-appointment', {
                doctorId: params.doctorId,
                userId: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: selectedDate,
                time: time,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            dispatch(hideLoading());
            if (res.data.success) {
                toast.success(res.data.message, { position: "top-right" });
                setSelectedSlot(time);
                fetchBookedSlots();
            } else {
                toast.error(res.data.message || "Booking failed");
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Failed to book the appointment. Try again.");
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDoctorData();
    }, []);

    useEffect(() => {
        if (doctor.timings) generateTimeSlots();
        fetchBookedSlots();
    }, [doctor, selectedDate]);

    const getSlotClass = (slot) => {
        const bookedSlot = bookedSlots.find((s) => s.time === slot);
        if (!bookedSlot) return 'btn-success';
        switch (bookedSlot.status) {
            case 'approved': return 'btn-danger';
            case 'pending': return 'btn-warning';
            case 'rejected': return 'btn-secondary';
            default: return 'btn-success';
        }
    };

    return (
        <Layout>
            <h3 className='text-center'>Booking Page</h3>
            <div className='container'>
                {doctor && (
                    <div className='card p-4 shadow-sm mt-3'>
                        <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
                        <h5>Specialization: {doctor.specialization}</h5>
                        <h5>Fees: ₹{doctor.feesPerConsultation}</h5>
                        <h5>Address: {doctor.address}</h5>
                        <h5>Available Time: {doctor.timings?.[0]} - {doctor.timings?.[1]}</h5>

                        <div className="mt-3 mb-3">
                            <div className="d-flex gap-3 flex-wrap">
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: 'green' }}></div>
                                    <span>Free Slot</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: 'red' }}></div>
                                    <span>Approved Slot</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow' }}></div>
                                    <span>Pending Slot</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', backgroundColor: 'grey' }}></div>
                                    <span>Rejected Slot</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-2 flex-wrap">
                            {dateOptions.map((dateOption, index) => (
                                <button
                                    key={index}
                                    className={`btn ${dateOption === selectedDate ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setSelectedDate(dateOption)}
                                >
                                    {dayjs(dateOption, 'DD-MM-YYYY').format('ddd, DD MMM')}
                                </button>
                            ))}
                        </div>

                        <div className='d-grid' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '1rem' }}>
                            {slots.length > 0 ? (
                                slots.map((slot, index) => (
                                    <button
                                        key={index}
                                        className={`btn ${getSlotClass(slot)} ${selectedSlot === slot ? 'border border-dark' : ''}`}
                                        onClick={() => !bookedSlots.some((s) => s.time === slot && s.status === 'approved') && handleBooking(slot)}
                                        disabled={bookedSlots.some((s) => s.time === slot && s.status === 'approved')}
                                    >
                                        {dayjs(selectedDate, 'DD-MM-YYYY').format('ddd, DD MMM')} | {slot}
                                    </button>
                                ))
                            ) : (
                                <div className="alert alert-info col-12 text-center">No slots available for selected date.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;
