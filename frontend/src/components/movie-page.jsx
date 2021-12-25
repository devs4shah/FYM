import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MovieRow from './movie-row';
import { setUser } from '../actions';

export default function MoviePage(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userReducer);
    const [isSaved, setSaved] = useState(null); // saved state
    const [isLiked, setLiked] = useState(null); // liked state
    const [movie, setMovie] = useState(undefined); // movie state

    useEffect(() => {
        // get movie request on mount
        axios
            .get('/movies/movie/' + props._id)
            .then((response) => {
                setMovie(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        window.scrollTo(0, 0);

        if (movie) {
            // checks if user has liked or saved movie
            console.log('Current user',user.currentUser);
            if (user.currentUser) {
                if (user.currentUser.Liked.find((item) => item === movie._id)) {
                    setLiked(true);
                }

                if (user.currentUser.saved.find((item) => item === movie._id)) {
                    setSaved(true);
                }
            }
        }
    }, [props._id]);

    useEffect(() => {
        // set document title
        if (movie) {
            document.title = movie.Title + ' | FYM';
            
            console.log('CurrentUser',user.currentUser)
            // checks if user has liked or saved movie
            if (user.currentUser) {
                if (user.currentUser.Liked.find((item) => item === movie._id)) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
                if (user.currentUser.saved.find((item) => item === movie._id)) {
                    setSaved(true);
                } else {
                    setSaved(false);
                }
            }
        }
    }, [movie, user, props._id]);

    function saveClick() {
        let params = {};

        if (isSaved) {
            setSaved(false);

            params = {
                id: user.currentUser._id,
                removeSaved: movie._id,
            };
        } else {
            setSaved(true);
            params = {
                id: user.currentUser._id,
                addSaved: movie._id,
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
                removeLiked: movie._id,
            };
        } else {
            setLiked(true);

            params = {
                id: user.currentUser._id,
                addLiked: movie._id,
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
