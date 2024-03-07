import './App.css';
import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
// import useAuthentication from './utils/useAuthentication';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} /> 
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/products" element={<ProductList />}/>
      </Routes>
    </Router>
  );
}

export default App;
