import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { setInStorage } from '../utils/storage';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../actions';

import checkedIcon from '../assets/img/checked.png';

export default function Login(props) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // error message
    const [register, setMode] = useState(false); // register or login
    const [loading, setLoading] = useState(false);

    const regex = { length: /.{6,}/, digit: /\d/, capital: /[A-Z]/ }; // regex for password creation

    // password requirements state
    const [passMin, setPassMin] = useState(false);
    const [passNum, setPassNum] = useState(false);
    const [passCapital, setPassCapital] = useState(false);

    const [buttonEnabled, setButtonEnabled] = useState(false); // submit button state

    const user = useSelector((state) => state.userReducer);
    const history = useHistory();

    const dispatch = useDispatch();

    useEffect(() => {
        // setting document title
        if (register) {
            document.title = 'Sign Up | Not IMDb';
        } else {
            document.title = 'Sign In | Not IMDb';
        }

        validPassword(password);
    }, [register]);

    // redirect to wherever user came from
    function redirect() {
        if (props.location.state) {
            history.push('/movie/' + props.location.state.redirectID);
        } else {
            history.goBack();
        }
    }

    // sign up request
    function signUpRequest() {
        setLoading(true);
        // Post request to backend
        axios({
            method: 'post',
            url: '/account/register',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                name: name,
                username: username,
                password: password,
            }),
        }).then((res) => {
            if (res.data.success) {
                // write token to storage
                setInStorage('not_imdb_roynulrohan', {
                    token: res.data.token,
                });
                setLoading(false);
                // dispatch user to redux and redirect
                dispatch(setUser(res.data.user));
                setTimeout(redirect, 1700);
            } else {
                setError(res.data.message);
            }
            setLoading(false);
        });
    }

    // sign in request
    function signInRequest() {
        setLoading(true);
        // Post request to backend
        axios({
            method: 'post',
            url: '/account/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                username: username,
                password: password,
            }),
        }).then((res) => {
            if (res.data.success) {
                // write token to storage
                setInStorage('not_imdb_roynulrohan', {
                    token: res.data.token,
                });
                setLoading(false);
                // dispatch user to redux and redirect
                dispatch(setUser(res.data.user));
                setTimeout(redirect, 1700);
            } else {
                setError(res.data.message);
            }

            setLoading(false);
        });
    }

    // username requirements
    function validUsername() {
        if (username.length >= 6 && username.length <= 14) {
            return (
                <div className='d-flex justify-content-between'>
                    <label>Username</label>
                    <small className='text-success'>6-14 characters</small>
                </div>
            );
        } else {
            return (
                <div className='d-flex justify-content-between'>
                    <label>Username</label>
                    <small className='text-danger'>6-14 characters</small>
                </div>
            );
        }
    }

    // function to update password requirements in realtime
    function validPassword(pass) {
        if (regex.length.test(pass)) {
            setPassMin(true);
        } else {
            setPassMin(false);
        }

        if (regex.digit.test(pass)) {
            setPassNum(true);
        } else {
            setPassNum(false);
        }

        if (regex.capital.test(pass)) {
            setPassCapital(true);
        } else {
            setPassCapital(false);
        }

        if (
            regex.length.test(pass) &&
            regex.digit.test(pass) &&
            regex.capital.test(pass)
        ) {
            setButtonEnabled(true);
        } else {
            setButtonEnabled(false);
        }
    }

    // sign in container
    function signInContainer() {
        return (
            <form className='container rounded p-4 pt-5 text-white h-100 d-flex flex-column justify-content-between'>
                <div>
                    <div class='form-group'>
                        <label>Username</label>
                        <input
                            name='username'
                            type='text'
                            class='form-control'
                            placeholder='Enter username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div class='form-group'>
                        <label>Password</label>
                        <input
                            name='password'
                            type='password'
                            class='form-control'
                            placeholder='Enter Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {error ? (
                    <small class='form-text text-danger'>{error}</small>
                ) : (
                    ''
                )}
                <div>
                    <div class='form-group'>
                        <small class='form-text text-muted'>
                            Don't have an account?
                            <a
                                class='text-warning text-decoration-none pointer'
                                onClick={() => {
                                    setMode(true);
                                    setError();
                                }}>
                                {' '}
                                Sign up
                            </a>
                        </small>
                    </div>{' '}
                    <button
                        type='submit'
                        onClick={() => signInRequest()}
                        class='btn btn-warning w-100'>
                        Sign In
                    </button>
                </div>
            </form>
        );
    }

    // sign up container
    function signUpContainer() {
        return (
            <form className='container rounded p-4 text-white h-100 d-flex flex-column justify-content-between'>
                <div class='form-group'>
                    <label>Name</label>
                    <input
                        name='name'
                        type='name'
                        class='form-control'
                        placeholder='Enter name'
                        value={name}
                        maxLength='35'
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div class='form-group'>
                    {validUsername()}
                    <input
                        name='username'
                        type='text'
                        class='form-control'
                        placeholder='Enter username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div class='form-group'>
                    <label>Password</label>
                    <input
                        name='password'
                        type='password'
                        class='form-control'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validPassword(e.target.value);
                        }}
                    />
                </div>
                <div class='form-group'>
                    <div className='d-flex justify-content-between flex-column h-100'>
                        {/* password requirements */}
                        <small
                            className={
                                passMin ? 'text-success' : 'text-danger'
                            }>
                            - Min. 6 characters
                        </small>
                        <small
                            className={
                                passNum ? 'text-success' : 'text-danger'
                            }>
                            - Must contain number (0-9)
                        </small>
                        <small
                            className={
                                passCapital ? 'text-success' : 'text-danger'
                            }>
                            - Must contain a capital letter (A-Z)
                        </small>
                    </div>
                </div>
                {error ? (
                    <small class='form-text text-danger'>{error}</small>
                ) : (
                    ''
                )}

                <div class='form-group'>
                    <small class='form-text text-muted'>
                        Already have an account?
                        <a
                            class='text-warning text-decoration-none pointer'
                            onClick={() => {
                                setMode(false);
                                setError();
                            }}>
                            {' '}
                            Login
                        </a>
                    </small>
                </div>

                <button
                    type='submit'
                    onClick={() => signUpRequest()}
                    class='btn btn-warning'
                    disabled={!buttonEnabled}>
                    Sign Up
                </button>
            </form>
        );
    }

    // get correct container based on state
    function getContainer() {
        if (loading) {
            return (
                <div className='container rounded p-4 text-white h-100 d-flex flex-column justify-content-center align-items-center'>
                    <h5>Loading...</h5>
                </div>
            );
        } else {
            if (user.currentUser) {
                return (
                    <div className='container rounded p-4 text-white h-100'>
                        <CSSTransition
                            in={true}
                            appear={true}
                            timeout={600}
                            classNames='fade'
                            unmountOnExit>
                            <div className='d-flex flex-column justify-content-center align-items-center h-100'>
                                <h5>You're logged in</h5>
                                <br />
                                <br />
                                <img
                                    src={checkedIcon}
                                    className='checked-icon'></img>
                            </div>
                        </CSSTransition>
                    </div>
                );
            } else {
                if (register) {
                    return signUpContainer();
                } else {
                    return signInContainer();
                }
            }
        }
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            unmountOnExit>
            <div>
                {/* background */}
                <div className='login-background'>
                    <div className='background-default'></div>
                    <div className='background-cover opacity-60'></div>
                </div>
                {/* login container */}
                <div className='login-container'>{getContainer()}</div>
            </div>
        </CSSTransition>
    );
}
