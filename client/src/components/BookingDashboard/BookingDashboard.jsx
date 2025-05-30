import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import './BookingDashboard.css';

const BookingDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
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

  // Available services
  const services = [
    { id: 1, name: 'Gel + capsule', price: '35dt' },
    { id: 2, name: 'Vernis Permanent', price: '25dt' },
    { id: 3, name: 'Vernis Pieds', price: '15dt' },
    { id: 4, name: 'Gel Capsule + Vernis pieds', price: '45dt' },
    { id: 5, name: 'Vernis Permanent main + pieds', price: '35dt' }
  ];

  // Available time slots
  const timeSlots = [
    '10:00 - 13:00', '13:00 - 16:00', '16:00 - 19:00',
    '19:00 - 21:00'
  ];

  // Mock booked slots
  useEffect(() => {
    const mockBookedSlots = new Set([
      '2025-05-29-10:00 - 13:00',
      '2025-05-29-13:00 - 16:00',
      '2025-05-30-10:00 - 13:00',
      '2025-06-02-16:00 - 19:00'
    ]);
    setBookedSlots(mockBookedSlots);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowServiceDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowServiceDropdown(false);
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

  const handleBookingSubmit = async () => {
    if (!selectedService) {
      showNotification('Please select a service before booking.', 'error');
      return;
    }

    if (!bookingData.name || !bookingData.email || !bookingData.whatsapp) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const slotKey = `${formatDate(selectedDate)}-${selectedTime}`;
      const newBookedSlots = new Set(bookedSlots);
      newBookedSlots.add(slotKey);
      setBookedSlots(newBookedSlots);

      // Complete booking payload including service
      const bookingPayload = {
        date: formatDate(selectedDate),
        time: selectedTime,
        service: {
          id: selectedService.id,
          name: selectedService.name,
          price: selectedService.price
        },
        customerInfo: {
          name: bookingData.name,
          email: bookingData.email,
          whatsapp: bookingData.whatsapp
        }
      };

      console.log('Booking submitted:', bookingPayload);

      // Reset form
      setBookingData({ name: '', email: '', whatsapp: '' });
      setShowBookingForm(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedService(null);
      
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
          <p className="subtitle">Select a service, date and time that works for you</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Services Dropdown */}
        {/* <div className="services-section">
          <h3 className="section-title">Services</h3>
          <div className="dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowServiceDropdown(!showServiceDropdown);
              }}
              className="dropdown-button"
            >
              <span className={selectedService ? 'selected-text' : 'placeholder-text'}>
                {selectedService 
                  ? `${selectedService.name} - ${selectedService.price}`
                  : 'Select a service'
                }
              </span>
              <ChevronDown 
                size={20} 
                className={`dropdown-icon ${showServiceDropdown ? 'rotated' : ''}`}
              />
            </button>
            
            {showServiceDropdown && (
              <div className="dropdown-menu">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="dropdown-item"
                  >
                    <span>{service.name}</span>
                    <span className="service-price">{service.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div> */}

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
                <span className="month-text">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
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
                  <span>Available Times for {selectedDate.toLocaleDateString()}</span>
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
                    {selectedService && (
                      <>
                        <br />
                        <strong>Service:</strong> {selectedService.name} - {selectedService.price}
                      </>
                    )}
                  </p>
                </div>

                <div className="booking-form">
                  {/* Service Selection in Form */}
                  <div className="form-group">
                    <label className="form-label">
                      <ChevronDown size={16} />
                      Service *
                    </label>
                    <div className="dropdown-container">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowServiceDropdown(!showServiceDropdown);
                        }}
                        className={`dropdown-button ${selectedService ? 'valid' : 'invalid'}`}
                      >
                        <span className={selectedService ? 'selected-text' : 'placeholder-text'}>
                          {selectedService 
                            ? `${selectedService.name} - ${selectedService.price}`
                            : 'Select a service *'
                          }
                        </span>
                        <ChevronDown 
                          size={20} 
                          className={`dropdown-icon ${showServiceDropdown ? 'rotated' : ''}`}
                        />
                      </button>
                      
                      {showServiceDropdown && (
                        <div className="dropdown-menu">
                          {services.map((service) => (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => handleServiceSelect(service)}
                              className="dropdown-item"
                            >
                              <span>{service.name}</span>
                              <span className="service-price">{service.price}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} />
                      Full Name *
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
                      Email Address *
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
                      WhatsApp Number *
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
                      type="button"
                      onClick={handleBookingSubmit}
                      disabled={isLoading || !selectedService}
                      className={`submit-button ${isLoading || !selectedService ? 'disabled' : ''}`}
                    >
                      {isLoading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;