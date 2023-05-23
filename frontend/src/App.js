import './App.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Navigation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HomePage = () => {
  const location = useLocation();
  const [variable, setVariable] = useState('');
  const [serverStatus, setServerStatus] = useState('online');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/home');
        const data = await response.json();
        setVariable(data.variable);
        setServerStatus('online');
      } catch (error) {
        console.error('Error:', error);
        setServerStatus('offline');
      }
    };

    fetchData();
  }, [location]);

  return (
    <div>
      {serverStatus === 'online' ? (
        <h1>Home Page + server's text: {variable}</h1>
      ) : (
        <h1>Server is offline</h1>
      )}
    </div>
  );
};

const AboutPage = () => {
  const location = useLocation();
  const [variable, setVariable] = useState('');
  const [serverStatus, setServerStatus] = useState('online');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/about');
        const data = await response.json();
        setVariable(data.variable);
        setServerStatus('online');
      } catch (error) {
        console.error('Error:', error);
        setServerStatus('offline');
      }
    };

    fetchData();
  }, [location]);

  return (
    <div>
      {serverStatus === 'online' ? (
        <h1>About Page + server's text: {variable}</h1>
      ) : (
        <h1>Server is offline</h1>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
