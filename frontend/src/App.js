import React, { Component, Suspense } from 'react';
import {  useLocation,BrowserRouter as Router,Route } from 'react-router-dom';
import './sass/App.scss';

const HomePage = React.lazy(() => import('./components/home-page'));
const Login=React.lazy(()=>import('./components/login'));
const MoviePage=React.lazy(()=>import('./components/movie-page'));
const Nav = React.lazy(() => import('./components/navbar'));
const UserProfile = React.lazy(() => import('./components/user-profile'));
const BrowsePage = React.lazy(() => import('./components/browse-page'));

export default class App extends Component {
  render() {
      return (
          <Router>
              <Suspense fallback={<div></div>}>
                  <div className="App">
                  <Nav />
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
                       <Route
                            path="/user/:id"
                            component={UserProfile}
                        />
                      <Route path="/login" component={Login} />
                      <Route path="/browse" component={BrowsePage} />
                  </div>
              </Suspense>
          </Router>
      );
  }
}