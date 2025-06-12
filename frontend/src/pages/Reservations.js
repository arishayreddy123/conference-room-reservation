import React, { useEffect, useState } from 'react';
import axios from '../api';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get('/reservations/')
      .then((res) => {
        setReservations(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('You must be logged in to view your reservations.');
      });
  }, [refresh]);

  const cancelReservation = (id) => {
    axios
      .delete(`/reservations/${id}/`)
      .then(() => {
        setRefresh(!refresh); // Trigger re-fetch
      })
      .catch((err) => {
        console.error(err);
        alert('Could not cancel reservation.');
      });
  };

  return (
    <div>
      <h2>My Reservations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {reservations.map((res) => (
          <li key={res.id} style={{ marginBottom: '15px' }}>
            <strong>{res.room}</strong> — {res.date} | {res.start_time}–{res.end_time}
            <br />
            <button onClick={() => cancelReservation(res.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reservations;
