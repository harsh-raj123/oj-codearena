import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Problems from './pages/Problems'; // ✅ Make sure this file exists and is correctly exported
import Compiler from './pages/Compiler';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/problems" element={<Problems />} /> {/* ✅ Added this line */}
        <Route path="/compiler/:id" element={<Compiler />} />

      </Routes>
    </Router>
  );
};

export default App;
