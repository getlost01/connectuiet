import User from './../models/alumni.js';

let auth =(req,res,next)=>{
    let token =req.cookies.UIETConnect;
    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            error :true
        });
        req.token= token;
        req.user=user;
        next();
    })
}

export default auth;