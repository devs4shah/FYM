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

    useEffect(()=>{
        if(register){
            document.title='Sign Up | FYM';
          }
        else{
            document.title='Sign In | FYM'
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
        console.log("Fine");
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
        }
        ).then((res) => {
            if (res.data.success) {
                // write token to storage
                setInStorage('fym',{
                    token:res.data.token,
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
                console.log('Print');
                // write token to storage
                setInStorage('fym',{
                    token:res.data.token,
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
