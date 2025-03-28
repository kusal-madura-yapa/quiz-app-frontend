import React, { useState } from 'react';

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5001/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await res.json();
    if (res.ok) {
      onLogin(data.user_id);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="login-screen">
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginScreen;
