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
  
