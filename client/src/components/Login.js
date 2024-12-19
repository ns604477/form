import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      // Log formData entries for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const response = await axios.post('http://localhost:8000/api/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        alert('Login successful!');
        navigate('/dashboard'); // Redirect to dashboard on successful login
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Server error. Please try again later.');
      }
    }
  };

  const handleSignInClick = () => {
    navigate('/signup'); // Redirect to signup page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <button className="signin-button" onClick={handleSignInClick}>SIGN IN</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file-input" className="file-input-label">
            <span className="file-input-icon" role="img" aria-label="camera">📷</span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="file-input"
          />
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="remember-container">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
          </div>
          <button type="submit">LOGIN</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
