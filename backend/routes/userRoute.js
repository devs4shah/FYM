const express = require('express');
const {remove} = require('../models/User');
const router=express.Router();
const User=require('../models/User');

router.route('/update').put(function(req,res){
    const {body}=req;
    const {
        id,
        addSaved,
        removeSaved,
        addLiked,
        removeLiked
        }=body;

        let param={};

        if(addSaved){
            params={$addToSet:{Saved:addSaved}};
        }
        if (removeSaved) {
            params = { $pull: { Saved: removeSaved } };
        }
    
        if (addLiked) {
            params = { $addToSet: { Liked: addLiked } };
        }
    
        if (removeLiked) {
            params = { $pull: { Liked: removeLiked } };
        }

        User.findOnceAndUpdate(
            { _id:id } ,
            params,
            { new : true, upsert : true },   
            function(err,result){
                if(err){
                    console.log(err);
                    res.send(err);
                } else {
                    res.send(result);
                }
            }         
        ); 
});

router.route('/register').post(function (req,res,next){
    const {body}= req;
    const {password,name}=body;
    let {username}=body;

    if(!name){
        return res.send({
            success:false,
            message:'Name cannot be blank',
        });
    }
    if(!username){
        return res.send({
            success:false,
            message:'Username cannot be blank',
        });
        }
    if(!password){
        return res.send({
            success:false,
            message: 'Password cannot be blank.',
        });
    }
    username=username.trim();
    if(username.length >14){
        return res.send({
            success: false,
            message:'Username cannot be longer than 14 characters.',
        });
    }
    else if(username.length < 6){
        return res.send({
            success: false,
            message: 'Username must be at least 6 characters.'
        });
    }

    User.find(
        {
            Username:username,
        },
        (err,previousUsers)=>{
            if(err){
                return res.send({
                    success:false,
                    message:"Server error.",
                });
            }
            else if (previousUsers.length>0){
                return res.send({
                    success:false,
                    message:'Error:Account with username already exists.'
                });
            }

            const newUser=new User({
                Name:name,
                Username:username,
            });

            newUser.set({Password:newUser.generateHash(password)});
            newUser.save((err,user)=>{
                console.log(user);
                if(err){
                    return res.send({
                        success:false,
                        message:'Server error.',
                    });
                }
                else{
                    console.log(newUser);
                }
            })

        });
    });
     
    router.route('/login').post(function(req,res,next){
        const {body}=req;
        const {password}=body;
        let {username}=body;

        if(!username){
            return res.send({
                success:false,
                message:'Username cannot be blank.'
            });
        }
        if(!password){
            return res.send({
                success:false,
                message:'Password cannot be blank.',
            })
        }
        username=username.trim();

        User.find({
            Username:username,
        },
        (err,users)=>{
            if(err){
                return res.send({
                    success:false,
                    message:'Server error.'
                });
            }
            if(users.length!=1){
                return res.send({
                    success:false,
                    message:'Either username and/or password is incorrect'
                });
            }
            const user=users[0];

            if(!user.validPassword(password)){
                return res.send({
                    success:false,
                    message:'Either username and/or password is incorrect'
                });
            }
        })

    })

    module.exports=router;