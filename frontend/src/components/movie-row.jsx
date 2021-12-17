import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './movie-card';
import { useSelector, useDispatch } from 'react-redux';

export default function MovieRow(props) {
    const user = useSelector((state) => state.userReducer);
    const scrollable = React.createRef(); // movie row ref
    const [movies, setMovies] = useState([]); // movies state
    const [width, setWidth] = useState(0); // screen width state
    const [buttonsHidden, setButtonsHidden] = useState(false); // hidden state of scroll buttons
    const [movieCount, setMovieCount] = useState(0); // movie count

    useEffect(() => {
        if (props.movies) {
            // make movies request with given movie ids and setstate
            axios
                .get('/movies/' + props.movies)
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            // make movies request with given params and setstate
            axios
                .get('/movies', {
                    params: props.params,
                })
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        updateWindowDimensions();

        // resize event listener to get width of row
        window.addEventListener('resize', updateWindowDimensions);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
        };
    }, [props.movies]);

    useEffect(() => {
        setWidth(scrollable.current.clientWidth);
        setMovieCount(scrollable.current.childElementCount);
        setButtonsHidden(
            scrollable.current.clientWidth < window.innerWidth - 200
        );
    }, [scrollable]);

    // update width of row
    function updateWindowDimensions() {
        if (scrollable.current) {
            setWidth(scrollable.current.clientWidth);
        }
    }

    // scroll function for row
    function scroll(offset) {
        updateWindowDimensions();
        if (scrollable.current) {
            scrollable.current.scrollLeft += offset;
        }
    }

    // set scroll function for row
    function setScroll(offset) {
        if (scrollable.current) {
            scrollable.current.scrollLeft = offset;
        }
    }

    return (
        <div className='movie-list-section'>
            <div className='p-3'>
                <h2
                    className='w-75 text-warning d-flex align-items-start'
                    onClick={() => {
                        setScroll(0);
                    }}>
                    <span>{props.title}</span>
                    {props.shouldCount && (
                        <span className='ml-4 badge badge-pill badge-warning'>
                            {movieCount}
                        </span>
                    )}
                </h2>

                <div className='d-flex align-items-center justify-content-between movie-list-container'>
                    <button
                        className='btn mr-2 arrow btn-dark-yellow p-1'
                        hidden={buttonsHidden}
                        onClick={() => {
                            scroll(-width);
                        }}>
                        <svg
                            width='1.8em'
                            height='1.5em'
                            viewBox='0 0 16 16'
                            class='bi bi-chevron-left'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                                fill-rule='evenodd'
                                d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
                            />
                        </svg>
                    </button>
                    <div
                        ref={scrollable}
                        className={
                            buttonsHidden
                                ? 'movie-list pb-4 ml-5 overflow-hidden'
                                : 'movie-list pb-4'
                        }>
                        {movies.map(function (currentMovie, i) {
                            return (
                                <MovieCard
                                    movie={currentMovie}
                                    key={props.title + currentMovie._id}
                                />
                            );
                        })}
                    </div>
                    <button
                        className='btn ml-2 arrow btn-dark-yellow p-1'
                        hidden={buttonsHidden}
                        onClick={() => {
                            scroll(width);
                        }}>
                        <svg
                            width='1.8em'
                            height='1.5em'
                            viewBox='0 0 16 16'
                            class='bi bi-chevron-right'
                            fill='currentColor'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                                fill-rule='evenodd'
                                d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
