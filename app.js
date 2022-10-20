import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import connectdb from './config/db.js';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cors({
    origin: '/'
}));

connectdb();
app.listen(process.env.PORT || 3000, function(){
    console.log("➡️ UIET Connect listening on port %d in %s mode 👍", this.address().port, app.settings.env);
});

import APIs from './APIs/alumniDetail.js';
app.use('/api', APIs);

import pages from './routes/pages.js';
app.use('/', pages)



app.get('*',async(req,res,next)=>{
    try {
      res.render('error');
    } catch (error) {
      next(error)
    }
  });