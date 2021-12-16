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
        year,
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
        query.Genre= { $regex: genre, $option:'i'};
    }
    if (year) {
        query.Year = year;
    }

    if (minImdbRating) {
        query.imdbRating = { $gte: minImdbRating, $ne: 'N/A' };
    }

    if (minMetascore) {
        query.Metascore = { $gte: minMetascore, $ne: 'N/A' };
    }

    if (actor) {
        query.Actors = { $regex: actor, $options: 'i' };
    }

    if (type) {
        query.Type = type;
    }

    if(random == 'true'){
        Movie.aggregate(
            [{$match:query},{$sample:{size:40}}],
            function(err,movies){
                if(err){
                    console.log(err);
                }
                else{
                    res.json(movies);
                }
            }
        );
    } else {
        Movie.find({
            $and: [
                {
                    $or: [
                        { Title: { $regex: search, $options: 'i' } },
                        { Plot: { $regex: search, $options: 'i' } },
                        { Genre: { $regex: search, $options: 'i' } },
                        { Actors: { $regex: search, $options: 'i' } },
                        { Year: { $regex: search, $options: 'i' } },
                        { Director: { $regex: search, $options: 'i' } },
                        { Writer: { $regex: search, $options: 'i' } },
                        { Production: { $regex: search, $options: 'i' } },
                        { Language: { $regex: search, $options: 'i' } },
                    ],
                },
                query,
            ],
        })

        .limit(60)
        .sort(sort && { [sort]:sortOrder})
        .exec(function (err,movies){
            if(err){
                console.log(err);
            } else {
                res.json(movies);  
            }
        });
    }
});
router.route('/update').put(function (req, res) {
    const { body } = req;
    const { id, addReview, removeReview } = body;

    let params = {};

    if (addReview) {
        params = {
            $addToSet: { Ratings: addReview },
        };
    }

    if (removeReview) {
        params = {
            $pull: { Ratings: removeReview },
        };
    }

    Movie.findOneAndUpdate(
        {_id:id},
        params,
        {new:true,upsert:true},
        function(err,result){
            if(err){
                console.log(err);
                res.send({success:false, message: err});

            } else{
                res.send({success:true,updated:result});
            }
        }
    );
});

router.route('/movie').get(function(req,res){
    Movie.count().exec(function (err,count){

        let random=Math.floor(Math.random()*count);

        Movie.findOne()
        .skip(random)
        .exec(function (err,movie){
            res.json(movie);
        });
    });
});

router.route('/movie/:id').get(function(req,res){
    let id=req.params.id;

    Movie.findById(id, function(err,movie){
        res.json(movie);
    });
});

router.route('/:ids').get(function (req,res){
    let ids=req.param.ids;

    ids=ids.split(',');

    ids.pop();

    Movie.find({ _id: {$in:ids}}, function (err,movies){
        if(err){
            console.log(err);
                } else{
                    res.json(movies);
                }
    });
});

module.exports=router;


