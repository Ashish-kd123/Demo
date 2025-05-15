import React, { useState } from 'react';
import axios from "../api/axio"; 
import { useNavigate } from 'react-router-dom'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', formData); 

      const { token, message } = response.data;

      if (token) {
        localStorage.setItem('token', token); 
        console.log('Login successful, token stored.');
        alert(message); 
        navigate('/subscribe'); 
      } else {
        console.error('No token received from login');
        alert("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert("Login failed. Please check your details and try again.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
