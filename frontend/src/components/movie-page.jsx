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

    // map genres into elements
    function getGenres(string) {
        if (string) {
            return (
                <h5>
                    {string.split(',').map((genre) => {
                        return (
                            <span
                                className='badge badge-secondary m-1 pointer'
                                onClick={() => {
                                    history.push({
                                        pathname: '/browse',
                                        genre: genre.trim(),
                                    });
                                }}>
                                {genre}
                            </span>
                        );
                    })}
                </h5>
            );
        }
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            key={props._id}
            unmountOnExit>
            <div>
                {movie && user  && (
                    <div className='movie-page mt-3'>
                        <div className='position-relative'>
                            <img
                                className='background-custom'
                                src={movie.Poster}></img>
                            <div className='background-cover opacity-80'></div>

                            <div className='container rounded p-3 text-white bg-transparent movie-page-container'>
                                <img
                                    className='mr-4 poster'
                                    src={movie.Poster}></img>
                                <div className='d-flex flex-column align-items-start mr-2'>
                                    <div>
                                        <h2 className='m-1'>
                                            {movie.Title} - {movie.Year}
                                        </h2>
                                        <h5>
                                            <span className='badge badge-info m-1'>
                                                {movie.Type
                                                    ? movie.Type.charAt(
                                                          0
                                                      ).toUpperCase() +
                                                      movie.Type.slice(1)
                                                    : ''}
                                            </span>
                                            <span className='badge badge-warning m-1'>
                                                Rated: {movie.Rated}
                                            </span>
                                            <span className='badge badge-primary m-1'>
                                                {movie.Runtime}
                                            </span>
                                            <span className='badge badge-danger m-1'>
                                                {movie.Released}
                                            </span>
                                            <span className='badge badge-success m-1'>
                                                {movie.Language}
                                            </span>
                                        </h5>

                                        <div>{getGenres(movie.Genre)}</div>
                                    </div>
                                    <div className='d-flex flex-column justify-content-center w-75 p-1 mt-2'>
                                        <p>{movie.Plot}</p>
                                    </div>
                                </div>

                                <div className='d-flex flex-column justify-content-between align-items-end w-25 mb-3'>
                                    <h3 className='d-flex justify-content-center'>
                                        <span className='badge badge-warning m-1'>
                                            {movie.imdbRating}
                                            <br />
                                            <small>IMDb</small>
                                        </span>
                                        <span
                                            className={'badge m-1'.concat(
                                                movie.Metascore < 50
                                                    ? ' badge-danger'
                                                    : ' badge-success'
                                            )}>
                                            {movie.Metascore}
                                            <br />
                                            <small>Metascore</small>
                                        </span>
                                    </h3>

                                    <div className='d-flex flex-column w-100'>
                                        <button
                                            className={
                                                isSaved === true
                                                    ? 'btn btn-info'
                                                    : 'btn btn-outline-info'
                                            }
                                            onClick={() => {
                                                if (user.currentUser) {
                                                    saveClick();
                                                } else {
                                                    history.push('/login');
                                                }
                                            }}>
                                            {isSaved === true
                                                ? '✓ Saved'
                                                : '+ For Later'}
                                        </button>

                                        <br />
                                        <button
                                            className={
                                                isLiked === true
                                                    ? 'btn btn-danger'
                                                    : 'btn btn-outline-danger'
                                            }
                                            onClick={() => {
                                                if (user.currentUser) {
                                                    likeClick();
                                                } else {
                                                    history.push('/login');
                                                }
                                            }}>
                                            {isLiked === true ? 'Liked' : 'Like'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='container rounded p-3 text-white bg-transparent'>
                            <h2>Info</h2>
                            <hr />
                            <div>
                                <h5 className='d-flex'>
                                    <b className='text-info w-20'>Director</b>
                                    <span className='w-75 ml-2'>
                                        {movie.Director}
                                    </span>
                                </h5>
                                <br />
                                <h5 className='d-flex'>
                                    <b className='text-info w-20'>Writer</b>
                                    <span className='w-75 ml-2'>
                                        {' '}
                                        {movie.Writer}
                                    </span>
                                </h5>
                                <br />
                                <h5 className='d-flex'>
                                    <b className='text-info w-20'>Cast</b>
                                    <span className='w-75 ml-2'>
                                        {' '}
                                        {movie.Actors}
                                    </span>
                                </h5>
                                <br />
                                <h5 className='d-flex'>
                                    <b className='text-info w-20'>Production</b>
                                    <span className='w-75 ml-2'>
                                        {movie.Production}
                                    </span>
                                </h5>
                                <br />
                                <h5 className='d-flex'>
                                    <b className='text-info w-20'>Awards</b>
                                    <span className='w-75 ml-2'>
                                        {' '}
                                        {movie.Awards}
                                    </span>
                                </h5>
                            </div>
                        </div>

                        <div className='mt-5'>
                            <MovieRow
                                title={'More like this'}
                                params={{
                                    random: true,
                                    genre: movie.Genre.split(',')[
                                        Math.floor(
                                            Math.random() *
                                                movie.Genre.split(',').length
                                        )
                                    ].trim(),
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </CSSTransition>
    );
}
