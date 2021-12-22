const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const Schema=mongoose.Schema;
const User = new Schema({
    name:{
        type:String,
        default:' '
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    saved:{
        type:Array,
        default:[]
    },
    Liked:{
        type:Array,
        default:[]
    },
});

User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

User.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports=mongoose.model('User',User)