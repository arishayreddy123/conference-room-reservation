import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useParams, useNavigate } from 'react-router-dom';

function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    room: '',
    date: '',
    start_time: '',
    end_time: '',
  });
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load reservation
  useEffect(() => {
    axios.get(`/reservations/${id}/`)
      .then(res => {
        setForm({
          room: res.data.room.id,
          date: res.data.date,
          start_time: res.data.start_time,
          end_time: res.data.end_time,
        });
        setRoomName(res.data.room.name);
      })
      .catch(() => {
        setError('Could not load booking.');
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.patch(`/reservations/${id}/`, form);
      setSuccess('Booking updated successfully!');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      const details = err.response?.data;
      const msg = details
        ? Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(' | ')
        : 'Unknown error';
      setError(`Update failed: ${msg}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Booking</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Room</label>
        <input value={roomName} disabled />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label>Start Time</label>
        <input
          type="time"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <label>End Time</label>
        <input
          type="time"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Booking</button>
      </form>
    </div>
  );
}

export default EditBooking;
