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
