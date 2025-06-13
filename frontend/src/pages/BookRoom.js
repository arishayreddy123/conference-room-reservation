import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function BookRoom() {
  const navigate = useNavigate();
  const { id: roomIdFromURL } = useParams();

  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    room: '',
    date: '',
    start_time: '',
    end_time: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/rooms/')
      .then((res) => {
        setRooms(res.data);
        if (roomIdFromURL) {
          setForm(prev => ({ ...prev, room: roomIdFromURL }));
        }
      })
      .catch(() => setError('Could not load rooms.'));
  }, [roomIdFromURL]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/reservations/', form);
      setSuccess('Room booked successfully!');
      setTimeout(() => navigate('/rooms'), 2000);
    } catch (err) {
      const msg = err.response?.data
        ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(' | ')
        : 'Unknown error';
      setError(`Booking failed: ${msg}`);
    }
  };

  return (
    <div>
      <h2>Book a Conference Room</h2>

      <form onSubmit={handleSubmit}>
        <label>Room</label>
        <select name="room" value={form.room} onChange={handleChange} required>
          <option value="">-- Select Room --</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.location})
            </option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Start Time</label>
        <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />

        <label>End Time</label>
        <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required />

        <button type="submit">Book</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default BookRoom;
