import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { setUser } from '../actions';
import axios from 'axios';
import MovieRow from './movie-row';

export default function UserProfile({match}) {
    const {
        params: { id },
      } = match;

    const currentUser = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [user, setUserState] = useState(undefined);
    const [likedQuery, setLikedQuery] = useState(''); // liked list query
    const [savedQuery, setSavedQuery] = useState(''); 

    
    useEffect(() => {

        console.log('PropsID---',id);
        // get user and update state on props change
        axios.get('/account/user/' + id).then((res) => {
            
            if (res.data) {

                // set user state
                setUserState(res.data);

                // set document title
                document.title = res.data.username + ' | FYM';

                // add movie ids to query
                if (res.data.Liked) {
                    let query = '';

                    res.data.Liked.forEach((id) => {
                        query += id + ',';
                    });

                    setLikedQuery(query);
                }

                if (res.data.saved) {
                    
                    let query = '';

                    res.data.saved.forEach((id) => {
                        query += id + ',';
                    });
                    console.log(query);
                    setSavedQuery(query);
                }
            }
        });
    },[id]);

        return (
            <CSSTransition
                in={true}
                appear={true}
                timeout={600}
                classNames='fade'
                unmountOnExit>
                <div>
                    {user && (
                        <div>
                            <div className='container rounded p-4 mt-4 text-white'>
                                <div className='d-flex flex-column w-50 justify-content-between mr-4'>
                                    <div className='d-flex m-1'>
                                        <h4 className='w-20 m-0'>
                                            <span className='badge badge-primary mr-3'>
                                                Name
                                            </span>
                                        </h4>
                                        <h3 className='m-0'>{user.name}</h3>
                                    </div>
                                    <div className='d-flex m-1'>
                                        <h4 className='w-20 m-0'>
                                            <span className='badge badge-primary mr-3'>
                                                @
                                            </span>
                                        </h4>
                                        <h3 className='m-0'>{user.username}</h3>
                                    </div>
    
                                    <br />
                                    <div className='d-flex m-1'>
                                        <h5 className='w-20 m-0'>
                                            <span className='badge badge-warning p-2 mr-3'>
                                                Joined
                                            </span>
                                        </h5>
                                        <h5>
                                            <span className='badge badge-secondary p-2 mr-3'>
                                                { Date(
                                                    user.DateCreated
                                                ).toLocaleString()}
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-5'>
                                {likedQuery && (
                                    <MovieRow
                                        key={'Liked'}
                                        title={'Liked List'}
                                        shouldCount='true'
                                        movies={likedQuery}></MovieRow>
                                )}
                                {savedQuery && (
                                    <MovieRow
                                        key={'Saved for Later'}
                                        title={'Saved for Later'}
                                        shouldCount='true'
                                        movies={savedQuery}></MovieRow>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CSSTransition>
        );
    }
    