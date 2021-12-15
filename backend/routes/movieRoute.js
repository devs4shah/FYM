const express = require('express');
const router = express.Router();

const Movie = require('../models/Movie');

router.use(function(req,res,next){
    for(var key in req.query){
        req.query[key.toLowerCase()]=req.query[key];
    }
    next();
});

router.route('/').get(function(req,res){
    const {
        random,
        search,
        sort,
        sortOrder,
        title,
        genre,
        ear,
        minImdbRating,
        minMetascore,
        actor,
        type,
    }=req.query;

    let query={};

    if(title){
        query.Title = { $regex: title, $options: 'i'};
    }
    if(genre){
        query.Genre= { $regex: genre}
    }

})