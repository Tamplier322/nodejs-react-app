import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './home';
import DashboardPage from './dashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul className="navbar">
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/dashboard">Дэшборд</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
