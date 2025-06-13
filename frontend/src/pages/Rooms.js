import React, { useEffect, useState } from 'react';
import axios from '../api';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/rooms/')
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load conference rooms.');
      });
  }, []);

  return (
    <div>
      <h2>Available Conference Rooms</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                width: '250px',
              }}
            >
              <h3>{room.name}</h3>
              <p><strong>Location:</strong> {room.location}</p>
              <p><strong>Capacity:</strong> {room.capacity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;
