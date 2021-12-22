import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import MovieCard from './movie-card';
import axios from 'axios';

const genres = [
    'Action',
    'Comedy',
    'Horror',
    'Romance',
    'Drama',
    'Animation',
    'Fantasy',
    'Sci-Fi',
    'Thriller',
    'Family',
    'Adventure',
    'Crime',
    'Mystery',
    'War',
    'Music',
    'Musical',
    'Western',
    'History',
    'Biography',
    'Sport',
];

export default function BrowsePage(props) {
    const [movies, setMovies] = useState([]); // movie list
    const [search, setSearch] = useState(''); // search bar
    const [genre, setGenre] = useState(
        props.location.genre ? props.location.genre : ''
    ); // filters
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [metascore, setMetascore] = useState('');
    const [sort, setSort] = useState(''); // sort options
    const [sortOrder, setSortOrder] = useState('ascending');

    useEffect(() => {
        document.title = 'Browse | FYM';
    }, []);
    useEffect(() => {
        // make delayed requests everytime search or filter parameters are changed
        const delayDebounceFn = setTimeout(() => {
            axios
                .get('/movies', {
                    params: {
                        random: !search ? true : false,
                        search: search,
                        genre: genre,
                        year: year,
                        type: type,
                        minMetascore: metascore,
                        sort: sort,
                        sortOrder: sortOrder,
                    },
                })
                .then((response) => {
                    setMovies(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, 250);

        return () => clearTimeout(delayDebounceFn);
    }, [search, genre, year, type, metascore, sort, sortOrder]);

    function resetFilters() {
        setGenre('');
        setYear('');
        setType('');
        setMetascore('');
        setSort('');
    }

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames='fade'
            unmountOnExit>
            <div className='d-flex flex-column justify-content-center align-items-center pt-4'>
                <div className='mb-3 text-info'>
                    <h1>Movies</h1>
                </div>
                <div className='container rounded p-3 mb-4 d-flex align-items-center justify-content-around w-100 position-relative'>
                    <input
                        className='browse-search w-75'
                        placeholder='Search... '
                        type='text'
                        spellCheck='false'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}></input>
                    <svg
                        onClick={() => {
                            setSearch('');
                        }}
                        display={search ? '' : 'none'}
                        width='2em'
                        height='2em'
                        viewBox='0 0 16 16'
                        class='bi bi-backspace-fill backspace'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            fill-rule='evenodd'
                            d='M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z'
                        />
                    </svg>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <div class='input-group m-1'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                onClick={() => {
                                    setGenre('');
                                }}>
                                Genre
                            </button>
                        </div>
                        <select
                            class={
                                genre == ''
                                    ? 'custom-select text-secondary'
                                    : 'custom-select text-white'
                            }
                            id='genreSelect'
                            value={genre}
                            onChange={(e) => {
                                setGenre(e.target.value);
                            }}>
                            <option
                                value=''
                                selected
                                className='text-secondary'>
                                Genre
                            </option>
                            {genres.map((genre) => {
                                return (
                                    <option
                                        value={genre}
                                        className='text-white'>
                                        {genre}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div class='input-group m-1'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                onClick={() => {
                                    setYear('');
                                }}>
                                Year
                            </button>
                        </div>

                        <input
                            type='text'
                            class='form-control'
                            maxLength='4'
                            placeholder='Year'
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value);
                            }}
                        />
                    </div>
                    <div class='input-group m-1'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                onClick={() => {
                                    setType('');
                                }}>
                                Type
                            </button>
                        </div>
                        <select
                            class={
                                type == ''
                                    ? 'custom-select text-secondary'
                                    : 'custom-select text-white'
                            }
                            id='typeSelect'
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                            }}>
                            <option
                                value=''
                                selected
                                className='text-secondary'>
                                Type
                            </option>
                            <option value='movie' className='text-white'>
                                Movie
                            </option>
                            <option value='series' className='text-white'>
                                TV Series
                            </option>
                        </select>
                    </div>
                    <div class='input-group m-1'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                onClick={() => {
                                    setMetascore('');
                                }}>
                                Metascore
                            </button>
                        </div>

                        <input
                            type='text'
                            class='form-control'
                            maxLength='4'
                            placeholder='Min. Rating'
                            value={metascore}
                            onChange={(e) => {
                                setMetascore(e.target.value);
                            }}
                        />
                    </div>
                    <div class='input-group m-1'>
                        <div class='input-group-prepend'>
                            <button
                                class='btn btn-dark-info'
                                type='button'
                                disabled={
                                    !(
                                        search ||
                                        genre ||
                                        year ||
                                        type ||
                                        metascore
                                    )
                                }
                                onClick={() => {
                                    if (sortOrder == 'ascending') {
                                        setSortOrder('descending');
                                    } else {
                                        setSortOrder('ascending');
                                    }
                                }}>
                                {sortOrder == 'ascending' ? (
                                    <svg
                                        width='1.3em'
                                        height='1.3em'
                                        viewBox='0 0 16 16'
                                        class='bi bi-sort-down'
                                        fill='currentColor'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            fill-rule='evenodd'
                                            d='M3 2a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0v-10A.5.5 0 0 1 3 2z'
                                        />
                                        <path
                                            fill-rule='evenodd'
                                            d='M5.354 10.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L3 11.793l1.646-1.647a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 9a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width='1.3em'
                                        height='1.3em'
                                        viewBox='0 0 16 16'
                                        class='bi bi-sort-up'
                                        fill='currentColor'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            fill-rule='evenodd'
                                            d='M3 13a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-1 0v10a.5.5 0 0 0 .5.5z'
                                        />
                                        <path
                                            fill-rule='evenodd'
                                            d='M5.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L3 3.207l1.646 1.647a.5.5 0 0 0 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 9a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z'
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <select
                            class={
                                sort == ''
                                    ? 'custom-select text-secondary'
                                    : 'custom-select text-warning'
                            }
                            id='sortSelect'
                            value={sort}
                            disabled={
                                !(search || genre || year || type || metascore)
                            }
                            onChange={(e) => {
                                setSort(e.target.value);
                            }}>
                            <option
                                value=''
                                selected
                                className='text-secondary'>
                                Sort By
                            </option>
                            <option value='Title' className='text-white'>
                                Title
                            </option>
                            <option value='Year' className='text-white'>
                                Year
                            </option>
                            <option value='Runtime' className='text-white'>
                                Runtime
                            </option>
                            <option value='Metascore' className='text-white'>
                                Metascore
                            </option>
                            <option value='imdbRating' className='text-white'>
                                IMDb Rating
                            </option>
                        </select>
                    </div>
                    <div class='input-group-clear m-1'>
                        <button
                            class='btn btn-dark-danger'
                            type='button'
                            onClick={() => {
                                resetFilters();
                            }}>
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div className='browse-grid'>
                    {movies.map(function (currentMovie, i) {
                        return (
                            <MovieCard
                                movie={currentMovie}
                                key={currentMovie._id}
                            />
                        );
                    })}
                </div>
            </div>
        </CSSTransition>
    );
}
