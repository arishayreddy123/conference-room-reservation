import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/token/', form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      navigate('/rooms'); // ✅ Redirect after login
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input name="username" value={form.username} onChange={handleChange} required />

        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
