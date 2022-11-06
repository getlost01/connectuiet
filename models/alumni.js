import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const salt=10;
const Schema = mongoose.Schema;
import * as dotenv from 'dotenv';
dotenv.config();

const alumniDetail = new Schema({
    name: String,
    degree: String,
    branch:String,
    image: String,
    batch: Number, 
    designation: String,
    city : String,
    email: String, 
    linkedin: String,
    password: String,
    password2: String,
    posts : [Schema.Types.Mixed],
    bio: String,
    company: String,
    username: String,
    token: String
},{timestamps:true})

alumniDetail.pre('save',function(next){
    var user=this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(salt,function(err,salt){
            if(err)return next(err);
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password=hash;
                user.password2=hash;
                next();
            })
        })
    }
    else{
        next();
    }
});

alumniDetail.methods.comparepassword=function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

alumniDetail.methods.generateToken=function(cb){
    var user =this;
    var token=jwt.sign(user._id.toHexString(),process.env.SECRET);

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

alumniDetail.statics.findByToken=function(token,cb){
    var user=this;

    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};

alumniDetail.methods.deleteToken=function(token,cb){
    var user=this;

    user.updateOne({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}
const alumni = mongoose.model('Alumnus',alumniDetail);

export default alumni;