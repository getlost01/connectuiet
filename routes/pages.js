import express from "express";
import alumni from'../models/alumni.js';
import post from '../models/post.js';
import auth from './../middlewares/auth.js'; 
const router = express.Router();


router.get('/',async(req,res,next)=>{
    try { res.render('home'); } catch (error) {next(error); }
});

router.get('/search',async(req,res,next)=>{
    try { let token=req.cookies.UIETConnect; alumni.findByToken(token,(err,user)=>{
        if(err) return  res(err);
            if(user) return res.render('search',user); 
            else return res.redirect('/login');});
    }catch (error) {next(error); }
});

router.get('/user/:username',async(req,res,next)=>{
    try { let token=req.cookies.UIETConnect; alumni.findByToken(token,(err,det)=>{
        if(err) return  res(err);
            if(det) {
                let username = req.params.username;
                alumni.find({username:username},(err,user)=>{
                    if(err) return  res(err);
                    if(user != null && user.length != 0){
                        post.find({
                            _id: user[0].posts
                          },(err,doc)=>{
                            if(err) return  res(err);
                            return res.render('profile',{user:user[0],doc:doc}); 
                          })
                    }else return res.redirect('/notfound');
                });
            }
            else return res.redirect('/login');});
    }catch (error) {next(error); }
});

router.get('/post/:postId',async(req,res,next)=>{
    try { let token=req.cookies.UIETConnect; alumni.findByToken(token,(err,det)=>{
        if(err) return  res(err);
            if(det) {
                let postId = req.params.postId;
                        post.find({
                            _id: postId
                          },(err,doc)=>{
                            if(err) return res.redirect('/notfound');
                            if(doc)return res.render('post',{doc:doc[0]}); 
                            else return res.redirect('/notfound');
                          })
            }
            else return res.redirect('/login');});
    }catch (error) {next(error); }
});

router.get('/dashboard',async(req,res,next)=>{
    try { let token=req.cookies.UIETConnect; alumni.findByToken(token,(err,user)=>{
            if(err) return  res(err);
            post.find({
                _id: user.posts
              },(err,doc)=>{
                if(err) return  res(err);
                console.log(doc);
                if(user) return res.render('settings',{user,doc}); 
                else return res.redirect('/login');});
              })
    }catch (error) {next(error); }
});

router.get('/login',async(req,res,next)=>{
    try { let token=req.cookies.UIETConnect; alumni.findByToken(token,(err,user)=>{
            if(err) return  res(err);
            if(user) return res.redirect('/dashboard'); 
            else return res.render('form');});
    }catch (error) {next(error); }
});

router.post('/login', async function(req,res){
  let token=req.cookies.UIETConnect;
  alumni.findByToken(token,(err,user)=>{
      if(err) return  res(err);
      if(user) {console.log(user);return res.status(400).json({
          error :true,
          message:"You are already logged in"
      });}
  
      else{
          alumni.findOne({'email':req.body.email},function(err,user){
              if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
      
              user.comparepassword(req.body.password,(err,isMatch)=>{
                  if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
      
              user.generateToken((err,user)=>{
                  if(err) return res.status(400).send(err);
                  res.cookie('UIETConnect',user.token).json({
                      isAuth : true,
                      id : user._id,
                      email : user.email
                  });
              });    
          });
        });
      }
  });
});
  
router.get('/logout',auth,async function(req,res){
  req.user.deleteToken(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.redirect('/');
  });

}); 
export default router;
  

