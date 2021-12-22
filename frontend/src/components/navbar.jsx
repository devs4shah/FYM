import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { Dropdown } from 'react-bootstrap/';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../actions';

import axios from 'axios';

import { getFromStorage } from '../utils/storage';

export default function Nav() {
    const user = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const history = useHistory();
    const profileOnClick = () => {
        history.push('/user/' + user.currentUser.username);
    };
    const [isClicked, setIsClicked] = useState(false); // user dropdown clicked state
    const location = useLocation();

    useEffect(() => {
        // verifies current user on mount
        // in nav since nav is in every page
        const obj = getFromStorage('fym');

        if (obj && obj.token) {
            const { token } = obj;

            axios.get('/account/verify?token=' + token).then((res) => {
                if (res.data.success) {
                    // write user to redux store
                    dispatch(setUser(res.data.user));
                } else {
                    dispatch(setUser());
                }
            });
        }
    }, []);

    // browse options
    function browseClick() {
        history.push('/browse');
    }

    // logout request
    function logout() {
        const obj = getFromStorage('fym');

        if (obj && obj.token) {
            const { token } = obj;

            axios.post('/account/logout?token=' + token).then((res) => {
                if (res.data.success) {
                    // remove user from redux store
                    dispatch(setUser());
                    // reload page
                    window.location.reload(false);
                }
            });
        }
    }
    // dropdown menu if users logged in
    function userDropdown() {
        return (
            // used Dropdown from React Bootstrap because for some reason the native one wouldn't work
            <Dropdown className='w-100' key='user-dropdown'>
                <Dropdown.Toggle
                    variant='warning'
                    id='dropdown'
                    className='profile-dropdown no-caret p-0'>
                    <div
                        className='d-flex justify-content-around pl-3 p-2'
                        onClick={() => {
                            setIsClicked(!isClicked);
                        }}>
                        {user.currentUser.username}
                        <div>
                            {
                                // sets correct arrow based on click state
                                isClicked ? (
                                    <svg
                                        width='1.2em'
                                        height='1.2em'
                                        viewBox='0 0 16 16'
                                        className='bi bi-chevron-down'
                                        fill='currentColor'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            fillRule='evenodd'
                                            d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width='1.2em'
                                        height='1.2em'
                                        viewBox='0 0 16 16'
                                        className='bi bi-chevron-up'
                                        fill='currentColor'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            fillRule='evenodd'
                                            d='M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z'
                                        />
                                    </svg>
                                )
                            }
                        </div>
                    </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className='w-100' align='right'>
                    <Dropdown.Header className='text-info'>
                        {user.currentUser.Name}
                    </Dropdown.Header>
                    <Dropdown.Item onClick={() => profileOnClick()}>
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item
                        onClick={() => logout()}
                        className='text-danger'>
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            unmountOnExit>
            <nav className='navbar navbar-expand-lg navbar-dark bg-darken-4'>
                <Link to='/' className='navbar-brand ml-5 pt-1 pb-1'>
                    <h3>
                        <span className='badge'>FYM</span>
                    </h3>
                </Link>
                <div className='navbar-nav mr-5 ml-2 pb-1'>
                <button className='btn browse-dropdown no-caret btn-dark-yellow' onClick={() => browseClick()}>
                    <svg
                        width='1.2em'
                        height='1.2em'
                        viewBox='0 0 16 16'
                        class='bi bi-list'
                        fill='currentColor'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            fillRule='evenodd'
                            d='M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
                        />
                    </svg>{' '}
                    Browse</button>
                </div>
                <div className='navbar-nav ml-auto mr-5 pt-1 pb-1'>
                    {user.currentUser ? (
                        userDropdown()
                    ) : (
                        <Link to='/login' key='login-button'>
                            <button
                                className='btn btn-dark-yellow'
                                disabled={location.pathname == '/login'}>
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </nav>
        </CSSTransition>
    );
}
