import React, { useState } from 'react';

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })  // ✅ sending both
    });

    const data = await res.json();
    if (res.ok) {
      onLogin(data.user_id);
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="login-screen">
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginScreen;
