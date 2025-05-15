import React, { useState } from 'react';
import axios from "../api/axio"; 
import { useNavigate } from 'react-router-dom'; 

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/signup', formData);  

      const { token, message } = response.data;

      if (token) {
        localStorage.setItem('token', response.data.token);
        console.log('Signup successful, token stored.');
        alert(message); 
      
        navigate('/login'); 
      } else {
        console.error('No token received from signup');
        alert("Error during signup. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      alert("Signup failed. Please check your details and try again.");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        name="fullName"
        placeholder="FullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
