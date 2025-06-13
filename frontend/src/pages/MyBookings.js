import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/reservations/');
      setBookings(res.data);
    } catch (err) {
      setError('Could not load your bookings.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.delete(`/reservations/${id}/`);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Could not cancel reservation.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div>
          {bookings.map(b => (
            <div key={b.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Room:</strong> {b.room.name}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.start_time} – {b.end_time}</p>
              <button onClick={() => navigate(`/edit-booking/${b.id}`)} style={{ marginRight: '10px' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(b.id)} style={{ color: 'red' }}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
