import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
      <Link to="/rooms" style={{ marginRight: '15px' }}>View Rooms</Link>

      {token ? (
        <>
          <Link to="/my-bookings" style={{ marginRight: '15px' }}>My Bookings</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
          <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
