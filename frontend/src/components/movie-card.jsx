import React,{useState,useEffect,useRef} from 'react';
import {Card, Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useSelector,useDispatch} from 'react-redux';
import axios from 'axios';
import { setUser } from '../actions';

export default function MovieCard(props) {
    const history = useHistory();
    const user = useSelector((state) => state.userReducer);
    const [isSaved, setSaved] = useState(null); // saved state
    const [isLiked, setLiked] = useState(null); // liked state
    const dispatch = useDispatch();

    useEffect(() => {
        // checks if user has liked or saved movie
        if (user.currentUser) {
            if (
                user.currentUser.Liked.find((item) => item === props.movie._id)
            ) {
                setLiked(true);
            }

            if (
                user.currentUser.saved.find((item) => item === props.movie._id)
            ) {
                setSaved(true);
            }
        }
    }, [user]);

    // onclick redirect to movie page
    function cardOnClick() {
        history.push('/movie/' + props.movie._id);
    }

    function saveClick() {
        let params = {};

        if (isSaved) {
            setSaved(false);
            params = {
                id: user.currentUser._id,
                removeSaved: props.movie._id,
            };
        } else {
            setSaved(true);
            params = {
                id: user.currentUser._id,
                addSaved: props.movie._id,
            };
        }

        // Post request to backend
        axios({
            method: 'put',
            url: '/account/update',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            dispatch(setUser(res.data));
        });
    }

    function likeClick() {
        let params = {};

        if (isLiked) {
            setLiked(false);

            params = {
                id: user.currentUser._id,
                removeLiked: props.movie._id,
            };
        } else {
            setLiked(true);

            params = {
                id: user.currentUser._id,
                addLiked: props.movie._id,
            };
        }

        // Post request to backend
        axios({
            method: 'put',
            url: '/account/update',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
        }).then((res) => {
            dispatch(setUser(res.data));
        });
    }
