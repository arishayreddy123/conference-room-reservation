import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

function BookRoom({ token, setToken }) {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

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
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/reservations/?date=${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const map = {};
      res.data.forEach((booking) => {
        if (!map[booking.room]) map[booking.room] = {};
        map[booking.room][booking.time_slot] = true;
      });
      setBookings(map);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const handleBooking = async (roomId, slot) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/reservations/", {
        room: roomId,
        date: selectedDate,
        time_slot: slot,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      alert("Booking failed. You may already have a booking at this time.");
    }
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar token={token} setToken={setToken} />
      <div style={{ padding: "30px" }}>
        <h2>Availability for {formattedDate}</h2>
        <label>
          <strong>Select Date:</strong>{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>

        <div style={{ marginTop: "20px" }}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                padding: "15px",
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <h3 style={{ margin: 0 }}>{room.name}</h3>
              <p style={{ margin: "4px 0" }}>Capacity: {room.capacity}</p>
              <p style={{ margin: "4px 0", color: "gray" }}>{room.location}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {timeSlots.map((slot) => {
                  const isBooked = bookings[room.id]?.[slot];
                  return isBooked ? (
                    <button
                      key={slot}
                      disabled
                      style={{
                        backgroundColor: "#f88",
                        color: "white",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        cursor: "not-allowed",
                      }}
                    >
                      {slot}
                    </button>
                  ) : (
                    <button
                      key={slot}
                      onClick={() => handleBooking(room.id, slot)}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BookRoom;
