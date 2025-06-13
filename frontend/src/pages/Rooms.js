import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/rooms/')
      .then(res => setRooms(res.data))
      .catch(() => setError('Could not load conference rooms.'));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Conference Rooms</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {rooms.map(room => (
            <div
              key={room.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                width: '280px',
              }}
            >
              <h3>{room.name}</h3>
              <p><strong>Location:</strong> {room.location}</p>
              <p><strong>Capacity:</strong> {room.capacity}</p>
              <button onClick={() => navigate(`/book/${room.id}`)}>
                Book This Room
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rooms;
