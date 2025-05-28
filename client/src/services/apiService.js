// apiService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get available time slots for a specific date
  async getAvailableSlots(date) {
    return this.request(`/slots/available?date=${date}`);
  }

  // Get all booked slots
  async getBookedSlots() {
    return this.request('/slots/booked');
  }

  // Create a new booking
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  // Cancel a booking
  async cancelBooking(bookingId, cancellationData) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      body: cancellationData,
    });
  }

  // Get booking details
  async getBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`);
  }

  // Send confirmation email
  async sendConfirmationEmail(bookingData) {
    return this.request('/notifications/email', {
      method: 'POST',
      body: bookingData,
    });
  }

  // Send WhatsApp message
  async sendWhatsAppMessage(bookingData) {
    return this.request('/notifications/whatsapp', {
      method: 'POST',
      body: bookingData,
    });
  }

  // Get business settings (working hours, holidays, etc.)
  async getBusinessSettings() {
    return this.request('/settings/business');
  }
}

export default new ApiService();