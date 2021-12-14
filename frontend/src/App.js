// import React, { Component, Suspense } from 'react';
import {  BrowserRouter as Router } from 'react-router-dom';
import './sass/App.scss';
import './App.css';
import Login from './Login.jsx';

function App() {
  return (
    <Router>
       <div className="App">
        <Login />
    </div>
  </Router>
  );
}

export default App;
