import React, { useEffect, useState } from 'react';
import axios from '../api';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('/rooms/')
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load rooms');
      });
  }, []);

  return (
    <div>
      <h2>Available Conference Rooms</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.id} style={{ marginBottom: '10px' }}>
            <strong>{room.name}</strong> — {room.location} | Capacity: {room.capacity}
            <br />
            <small>{room.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rooms;
