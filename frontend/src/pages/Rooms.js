// src/pages/Rooms.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get('http://127.0.0.1:8000/api/rooms/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setRooms(res.data);
      } catch (err) {
        setError('Unable to load rooms. Please try again later.');
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Conference Rooms</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.location}</td>
              <td>{room.capacity}</td>
              <td>{room.description}</td>
              <td>
                <button onClick={() => navigate(`/book/${room.id}`)}>Book Room</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Rooms;
