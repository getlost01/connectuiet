import express from "express";
import alumni from'../models/alumni.js';
import auth from './../middlewares/auth.js'; 
const router = express.Router();

router.post('/updateUser',async(req,res,next)=>{
    try {
        let token=req.cookies.UIETConnect;
        alumni.findByToken(token,(err,user)=>{
           if(err) return  res(err);
           alumni.updateOne({_id: user._id},req.body, function (err) { if (err){console.log(err);} });
           if(user) return res.redirect('/dashboard'); 
      });
    } catch (error) {
      next(error)
    }
  })


import tempData from '../tempData/tempData.js';
router.get('/updateTemp',async(req,res,next)=>{
    try{
          alumni.deleteMany({},(err)=>{
              if (err) console.log(err)
              tempData.forEach(async(alumData) => {
                const {name,qualification,image,batch,branch,degree,city,email,linkedin,designation,password,password2} = alumData;
                const newAlumni = new alumni({name,qualification,image,batch:parseInt(batch),designation,branch,degree,city,email,linkedin,password,password2});
                const result = await newAlumni.save();
              });
          });
          res.send("DONE");
      } catch (error) {
      next(error)
      }
  })


  router.get('/user30',async(req,res,next)=>{
    try {
      var q = alumni.find({}).limit(20).sort({_id: -1});
      q.exec(function(err, property) {
          if (err) res.send(err);
          res.json(property);
      });
      // res.send("done");
    } catch (error) {
      next(error)
    }
  });

  router.get('/search',async(req,res,next)=>{
    try {
      console.log(req.query);
      console.log(req.query.batch);
      var query = {
        name: { "$regex": req.query.name, "$options": "i"}
      };
      if(req.query.batch) query["batch"] = parseInt(req.query.batch);
      if(req.query.branch) query["branch"] = { "$regex": req.query.branch, "$options": "i"};
      alumni.find(query,
      function(err,docs) { 
        res.json(docs);
      });
      // res.send("done");
    } catch (error) {
      next(error)
    }
  });

  router.post('/register',function(req,res){
    // taking a user
    const newuser=new alumni(req.body);
    console.log(req.body);
   if(newuser.password!=newuser.password2)return res.status(400).json({message: "password not match"});
    
    alumni.findOne({email:newuser.email},function(err,user){
        if(user) return res.status(400).json({ auth : false, message :"email exits"});
 
        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({ success : false});}
            res.status(200).json({
                succes:true,
                user : doc
            });
        });
    });
 });
  
router.post('/login', function(req,res){
  let token=req.cookies.UIETConnect;
  alumni.findByToken(token,(err,user)=>{
      if(err) return  res(err);
      if(user) return res.redirect('/dashboard'); 
  
      else{
          alumni.findOne({'email':req.body.email},function(err,user){
              if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
      
              user.comparepassword(req.body.password,(err,isMatch)=>{
                  if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
      
              user.generateToken((err,user)=>{
                  if(err) return res.status(400).send(err);
                  res.cookie('UIETConnect',user.token).redirect('/dashboard');
              });    
          });
        });
      }
  });
});
  
router.get('/logout',auth,function(req,res){
  req.user.deleteToken(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.sendStatus(200);
  });

}); 
export default router;
  

