// Quick test script: start server (via dist) and call signup/login/me
const path = require('path');
require('./dist/index.js');

const run = async () => {
  const email = `test+${Date.now()}@example.com`;
  const payload = { email, password: 'Test1234', displayName: 'Automated Test' };
  try {
    console.log('Creating account', email);
    let res = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const signup = await res.json();
    console.log('Signup response:', signup);

    if (!signup.token) {
      console.error('Signup did not return token, bailing');
      process.exit(2);
    }

    console.log('Logging in with same credentials');
    res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: payload.email, password: payload.password })
    });
    const login = await res.json();
    console.log('Login response:', login);

    const token = login.token || signup.token;
    console.log('Using token:', token ? 'present' : 'missing');

    res = await fetch('http://localhost:4000/api/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const me = await res.json();
    console.log('Me response:', me);

    process.exit(0);
  } catch (err) {
    console.error('Test failed', err);
    process.exit(1);
  }
};

// give server a moment
setTimeout(run, 600);
