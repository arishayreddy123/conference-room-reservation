import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/rooms">Rooms</Link> |{' '}
      <Link to="/reservations">My Reservations</Link> |{' '}
      {isLoggedIn ? (
        <>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
