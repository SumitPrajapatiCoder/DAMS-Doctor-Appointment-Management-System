
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
        let slots = [];
        let currentTime = dayjs(start, 'HH:mm');
        const endTime = dayjs(end, 'HH:mm');

        while (currentTime.isBefore(endTime)) {
            slots.push(currentTime.format('HH:mm'));
            currentTime = currentTime.add(1, 'hour');
        }
        setSlots(slots);
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
                fetchBookedSlots();
            }
        } catch (error) {
            dispatch(hideLoading());
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
                    <div className='m-2'>
                        <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
                        <h4>Specialization: {doctor.specialization}</h4>
                        <h4>Fees: {doctor.feesPerConsultation}</h4>
                        <h4>Address: {doctor.address}</h4>
                        <h4>Available Time: {doctor.timings?.[0]} - {doctor.timings?.[1]}</h4>
                        <div className="mt-2">
                            <div className="d-flex gap-3 flex-wrap">
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', borderRadius: '3px', backgroundColor: 'green' }}></div>
                                    <span>Free Slot</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', borderRadius: '3px', backgroundColor: 'red' }}></div>
                                    <span>Approved Slot</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', borderRadius: '3px', backgroundColor: 'yellow' }}></div>
                                    <span>Pending Slot</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <div style={{ width: '20px', height: '20px', borderRadius: '3px', backgroundColor: 'grey' }}></div>
                                    <span>Rejected Slot</span>
                                </div>
                            </div>
                        </div><br />

                        <div className="d-flex gap-2 mt-2">
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

                        <div className='d-flex flex-wrap gap-2 mt-3'>
                            {slots.map((slot, index) => (
                                <button
                                    key={index}
                                    className={`btn btn-block ${getSlotClass(slot)}`}
                                    onClick={() => !bookedSlots.some((s) => s.time === slot && s.status === 'approved') && handleBooking(slot)}
                                    disabled={bookedSlots.some((s) => s.time === slot && s.status === 'approved')}
                                >
                                    {dayjs(selectedDate, 'DD-MM-YYYY').format('ddd, DD MMM')} | {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;