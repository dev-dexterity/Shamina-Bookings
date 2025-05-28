import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import './BookingDashboard.css';

const BookingDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Mock booked slots (in real app, fetch from backend)
  useEffect(() => {
    // Simulate some pre-booked slots
    const mockBookedSlots = new Set([
      '2025-05-29-10:00',
      '2025-05-29-14:30',
      '2025-05-30-11:00',
      '2025-06-02-15:00'
    ]);
    setBookedSlots(mockBookedSlots);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isTimeSlotAvailable = (date, time) => {
    const slotKey = `${formatDate(date)}-${time}`;
    return !bookedSlots.has(slotKey);
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setShowBookingForm(false);
  };

  const handleTimeClick = (time) => {
    if (!isTimeSlotAvailable(selectedDate, time)) return;
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const slotKey = `${formatDate(selectedDate)}-${selectedTime}`;
      const newBookedSlots = new Set(bookedSlots);
      newBookedSlots.add(slotKey);
      setBookedSlots(newBookedSlots);

      // In real app, make API call to backend
      const bookingPayload = {
        date: formatDate(selectedDate),
        time: selectedTime,
        ...bookingData
      };

      console.log('Booking submitted:', bookingPayload);

      // Reset form
      setBookingData({ name: '', email: '', whatsapp: '' });
      setShowBookingForm(false);
      setSelectedDate(null);
      setSelectedTime(null);
      
      showNotification('Booking confirmed! Check your email for confirmation details.');
    } catch (error) {
      showNotification('Booking failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setShowBookingForm(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="booking-dashboard">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">Book Your Appointment</h1>
          <p className="subtitle">Select a date and time that works for you</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {notification.message}
          </div>
        )}

        <div className="main-content">
          {/* Calendar Section */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button
                onClick={() => navigateMonth(-1)}
                className="nav-button"
              >
                ←
              </button>
              <h2 className="month-title">
                <Calendar size={24} />
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="nav-button"
              >
                →
              </button>
            </div>

            {/* Day names */}
            <div className="day-names">
              {dayNames.map(day => (
                <div key={day} className="day-name">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="calendar-grid">
              {getDaysInMonth(currentMonth).map((date, index) => {
                if (!date) {
                  return <div key={index} className="empty-day"></div>;
                }

                const isAvailable = isDateAvailable(date);
                const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={!isAvailable}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots and Booking Section */}
          <div className="booking-section">
            {/* Time Slots */}
            {selectedDate && (
              <div className="time-slots-section">
                <h3 className="section-title">
                  <Clock size={20} />
                  Available Times for {selectedDate.toLocaleDateString()}
                </h3>
                <div className="time-slots-grid">
                  {timeSlots.map(time => {
                    const isAvailable = isTimeSlotAvailable(selectedDate, time);
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeClick(time)}
                        disabled={!isAvailable}
                        className={`time-slot ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Booking Form */}
            {showBookingForm && (
              <div className="booking-form-section">
                <h3 className="section-title">Book Appointment</h3>
                <div className="selected-info">
                  <p>
                    <strong>Selected:</strong> {selectedDate.toLocaleDateString()} at {selectedTime}
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="booking-form">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} />
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={bookingData.whatsapp}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="submit-button"
                    >
                      {isLoading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;