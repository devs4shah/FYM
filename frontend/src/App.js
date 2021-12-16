import React, { Component, Suspense } from 'react';
import {  useLocation,BrowserRouter as Router,Route } from 'react-router-dom';
import './sass/App.scss';

const Login=React.lazy(()=>import('./components/login-page'));
const MovePage=React.lazy(()=>import('./components/movie-page'));


function App() {
  return (
    <Router>
       <div className="App">
        <MovieCard />
    </div>
  </Router>
  );
}

export default App;
