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
