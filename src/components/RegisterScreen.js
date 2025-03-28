import React, { useState } from 'react';
import '../styles/LoginScreen.css';

function RegisterScreen({ onRegisterComplete }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch('http://localhost:5001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Registration successful. Please login.");
      onRegisterComplete();
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create an Account 📝</h2>
        <p className="subtitle">Please fill in the details below</p>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="input-field"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="input-field"
        />
        <button onClick={handleRegister} className="login-button">Register</button>
        <p className="subtitle">
          Already have an account?{' '}
          <span className="link" onClick={onRegisterComplete}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterScreen;
