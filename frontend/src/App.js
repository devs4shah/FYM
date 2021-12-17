import React, { Component, Suspense } from 'react';
import {  useLocation,BrowserRouter as Router,Route } from 'react-router-dom';
import './sass/App.scss';


const HomePage = React.lazy(() => import('./components/home-page'));
const Login=React.lazy(()=>import('./components/login'));
const MoviePage=React.lazy(()=>import('./components/movie-page'));

export default class App extends Component {
  render() {
      return (
          <Router>
              <Suspense fallback={<div></div>}>
                  <div className="App">
                      <Route path="/" exact component={HomePage} />
                      <Route
                          path="/movie"
                          component={() => (
                              <MoviePage
                                  // passing id from path
                                  _id={useLocation().pathname.replace(
                                      '/movie/',
                                      ''
                                  )}
                              />
                          )}
                      />
                      <Route path="/login" component={Login} />
                  </div>
              </Suspense>
          </Router>
      );
  }
}