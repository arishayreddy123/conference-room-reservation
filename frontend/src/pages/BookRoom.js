// src/pages/BookRoom.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const timeSlots = ["8-10", "10-12", "12-2", "2-4", "4-6"];

function BookRoom({ token }) {
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [bookings, setBookings] = useState({});

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedDate) fetchBookings();
  }, [selectedDate]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/rooms/");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/reservations/?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingsMap = {};
      res.data.forEach((booking) => {
        if (!bookingsMap[booking.room]) bookingsMap[booking.room] = {};
        bookingsMap[booking.room][booking.time_slot] = true;
      });
      setBookings(bookingsMap);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  const handleBook = async (roomId, timeSlot) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/reservations/", {
        room: roomId,
        date: selectedDate,
        time_slot: timeSlot,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings(); // Refresh the view
    } catch (error) {
      alert("Booking failed. You may already have a booking.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Book a Room</h2>

      <label>
        Select Date:{' '}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </label>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Room</th>
            {timeSlots.map((slot) => (
              <th key={slot}>{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              {timeSlots.map((slot) => {
                const isBooked = bookings[room.id]?.[slot];
                return (
                  <td key={slot}>
                    <button
                      style={{
                        backgroundColor: isBooked ? 'red' : 'green',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                      }}
                      disabled={isBooked}
                      onClick={() => handleBook(room.id, slot)}
                    >
                      {isBooked ? 'Booked' : 'Book'}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookRoom;
