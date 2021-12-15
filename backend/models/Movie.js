const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema({
    Title: {
        type: String,
    },
    Year: {
        type: String,
    },
    Rated: {
        type: String,
    },
    Released: {
        type: String,
    },
    Runtime: {
        type: String,
    },
    Genre: {
        type: String,
    },
    Director: {
        type: String,
    },
    Writer: {
        type: String,
    },
    Actors: {
        type: String,
    },
    Plot: {
        type: String,
    },
    Language: {
        type: String,
    },
    Country: {
        type: String,
    },
    Awards: {
        type: String,
    },
    Poster: {
        type: String,
    },
    Ratings: {
        type: Array,
    },
    Metascore: {
        type: String,
    },
    imdbRating: {
        type: String,
    },
    imdbVotes: {
        type: String,
    },
    imdbID: {
        type: String,
    },
    Type: {
        type: String,
    },
    DVD: {
        type: String,
    },
    BoxOffice: {
        type: String,
    },
    Production: {
        type: String,
    },
    Website: {
        type: String,
    },
});

module.exports= mongoose.model('Movie', Movie);
