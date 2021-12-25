import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

const { default: MovieRow } = require('./movie-row');

// row parameters as objects
const rows = [
    { title: 'For you', params: { random: true } },
    { title: 'Tom Cruise', params: { random: true, actor: 'Tom Cruise' } },
    { title: 'TV Shows', params: { random: true, type: 'series' } },
    { title: '2020', params: { random: true, year: '2020' } },
];

export default function HomePage() {
    useEffect(() => {
        document.title = 'Home | FYM';
    }, []);

    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
            unmountOnExit
        >
            <div>
                <div className="pt-4">
                    {/* map rows */}
                    {rows.map(({ title, params }) => {
                        return (
                            <MovieRow
                                key={title}
                                title={title}
                                params={params}
                            ></MovieRow>
                        );
                    })}
                </div>
            </div>
        </CSSTransition>
    );
}
