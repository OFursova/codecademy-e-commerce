import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Route */}
        <Route path="/register" element={<RegistrationForm />} /> {/* Use element prop */}
      </Routes>
    </Router>
  );
}

export default App;
