import express from "express";
import alumni from'../models/alumni.js';
import post from'../models/post.js';
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
                const {name,qualification,image,batch,branch,degree,city,email,linkedin,designation,password,password2,company,username} = alumData;
                const newAlumni = new alumni({name,qualification,image,batch:parseInt(batch),designation,branch,degree,city,email,linkedin,password:"1234",password2:"1234",company,username});
                const result = await newAlumni.save();
              });
          });
          res.send("DONE");
      } catch (error) {
      next(error)
      }
  })

  router.get('/usernameSearch',async(req,res,next)=>{
    try {
      var q = alumni.find({username:req.query.uname},(err,doc)=>{
        if (err) console.log(err)
        else {
          if(doc.length != 0) res.send({found: true});
          else  res.send({found: false});
        }
      })
      // res.send("done");
    } catch (error) {
      next(error)
    }
  });

  router.get('/emailSearch',async(req,res,next)=>{
    try {
      var q = alumni.find({email:req.query.email},(err,doc)=>{
        if (err) console.log(err)
        else {
          if(doc.length != 0) res.send({found: true});
          else  res.send({found: false});
        }
      })
      // res.send("done");
    } catch (error) {
      next(error)
    }
  });

  router.get('/user30',async(req,res,next)=>{
    try {
      var q = alumni.find({}).limit(20).sort({_id: 1});
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
      // console.log(req.query.batch);
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
                doc.generateToken((err,user)=>{
                  if(err) return res.status(400).send(err);
                  res.cookie('UIETConnect',user.token).cookie('name', user.name).redirect('/dashboard');
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
              if(!user) return res.redirect('/login');
      
              user.comparepassword(req.body.password,(err,isMatch)=>{
                  if(!isMatch) return res.redirect('/login');
      
              user.generateToken((err,user)=>{
                  if(err) return res.redirect('/login');
                  res.cookie('UIETConnect',user.token).cookie('name', user.name).redirect('/dashboard');
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

router.post('/createPost',function(req,res){
    let token = req.cookies.UIETConnect;
    let userDet = req.body;
    alumni.findByToken(token,(err,user)=>{
      if(err) return  res(err);
      userDet.createdBy=user.name;
      userDet.designation=user.designation;
      userDet.userId= user.username;
      userDet.image = user.image;
    const newpost = new post(userDet);
    console.log(newpost);
    newpost.save((err,doc)=>{
      if(err) {console.log(err);
          return res.status(400).json({ success : false});}
               let posts = user.posts;
              //  console.log(newpost._id);
               posts.push(newpost._id);
               alumni.updateOne({_id: user._id},{posts: posts}, function (err) { if (err){console.log(err);} });
               if(user) return res.redirect('/dashboard'); 
         });
    });
}); 

router.get('/getPost',async(req,res,next)=>{
  try {
    var q = post.find({}).sort({_id: -1});
    q.exec(function(err, property) {
        if (err) res.send(err);
        res.json(property);
    });
    // res.send("done");
  } catch (error) {
    next(error)
  }
}); 

export default router;
  

