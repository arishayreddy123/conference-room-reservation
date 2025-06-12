import React, { useState } from 'react';
import axios from '../api';

function BookingForm({ roomId, onSuccess }) {
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/reservations/', {
        room: roomId,
        ...formData
      });
      setSuccess('Reservation made!');
      onSuccess && onSuccess();
    } catch (err) {
      setError('Could not book room. Are you logged in? Is the time valid?');
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Start Time:</label>
        <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />

        <label>End Time:</label>
        <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />

        <button type="submit">Book</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

export default BookingForm;
