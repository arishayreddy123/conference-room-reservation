import React, { useEffect, useState } from "react";
import axios from "axios";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

const BookRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

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
      const res = await axios.get("http://127.0.0.1:8000/api/reservations/");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [selectedDate]);

  const handleSlotClick = (room, slot) => {
    const isBooked = bookings.some(
      (b) =>
        b.room === room.id &&
        b.date === selectedDate &&
        b.time === slot
    );

    if (isBooked) {
      alert("Room is already booked for this time.");
    } else {
      setSelectedRoom(room);
      setSelectedSlot(slot);
      setShowConfirm(true);
    }
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/reservations/",
        {
          room: selectedRoom.id,
          date: selectedDate,
          time: selectedSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking successful!");
      setShowConfirm(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Availability for {new Date(selectedDate).toLocaleDateString()}</h2>

      <label><strong>Select Date: </strong></label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <br /><br />

      {rooms.length === 0 ? (
        <p>⚠️ No rooms available.</p>
      ) : (
        rooms.map((room) => (
          <div key={room.id} style={{ marginBottom: "30px" }}>
            <h3>{room.name}</h3>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><em>{room.location}</em></p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {timeSlots.map((slot) => {
                const isBooked = bookings.some(
                  (b) => b.room === room.id && b.date === selectedDate && b.time === slot
                );
                return (
                  <button
                    key={slot}
                    onClick={() => handleSlotClick(room, slot)}
                    style={{
                      backgroundColor: isBooked ? "#e74c3c" : "#2ecc71",
                      color: "white",
                      padding: "10px 16px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: isBooked ? "not-allowed" : "pointer",
                    }}
                    disabled={isBooked}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <hr />
          </div>
        ))
      )}

      {/* Modal confirmation dialog */}
      {showConfirm && selectedRoom && (
        <div style={{
          position: "fixed",
          top: "0", left: "0", right: "0", bottom: "0",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "8px",
            width: "400px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}>
            <h3>Confirm Booking</h3>
            <p><strong>Room:</strong> {selectedRoom.name}</p>
            <p><strong>Location:</strong> {selectedRoom.location}</p>
            <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedSlot}</p>
            <button
              onClick={confirmBooking}
              style={{ backgroundColor: "#27ae60", color: "white", marginRight: "10px", padding: "10px 20px" }}
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              style={{ backgroundColor: "#aaa", color: "white", padding: "10px 20px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRoom;
