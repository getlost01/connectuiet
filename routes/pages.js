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
                            if(doc)return res.render('post',{doc:doc[0],content:doc[0].post}); 
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

                if(user) return res.render('settings',{user,doc}); 
                else return res.redirect('/login');});
              })
    }catch (error) {next(error); }
});

router.get('/login',async(req,res,next)=>{
    try { let token=req.cookies.UIETConnect; alumni.findByToken(token,(err,user)=>{
            if(err) return res.render('form');
            if(user) return res.redirect('/dashboard'); 
            else return res.render('form');});
    }catch (error) {next(error); }
});

router.post('/login', async function(req,res){
  let token=req.cookies.UIETConnect;
  alumni.findByToken(token,(err,user)=>{
      if(err) return res.render('form');
      if(user) return res.render('form');
      else{
          alumni.findOne({'email':req.body.email},function(err,user){
              if(!user) return res.render('form', {message: 'Auth failed ,email not found'});
      
              user.comparepassword(req.body.password,(err,isMatch)=>{
                  if(!isMatch) return res.render('form', {message: "password doesn't match"});
      
              user.generateToken((err,user)=>{
                  if(err) return res.render('form');
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

router.get('/comingsoon',async(req,res,next)=>{
    try { res.render('error',{title:"Under Developement! Coming Soon 🚧"}); } catch (error) {next(error); }
});

router.get('/noPermission',async(req,res,next)=>{
    try { res.render('unauth'); } catch (error) {next(error); }
});

router.get('/about',async(req,res,next)=>{
    try { 
        let username = "GL01";
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
    }catch (error) {next(error); }
});



export default router;
  

