const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const Schema=mongoose.Schema;

const User = new Schema({
    Name:{
        type:String,
        default:''
    },
    Username:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true
    },
    Saved:{
        type:Array,
        default:[]
    },
    Liked:{
        type:Array,
        default:[]
    },
});

User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password,this.password);
};

User.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

module.exports=mongoose.model('User',User)