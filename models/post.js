import mongoose from "mongoose";
const Schema = mongoose.Schema;
import * as dotenv from 'dotenv';
dotenv.config();

const postDetail = new Schema({
    title: String,
    category: String,
    visibilty: String,
    post: String,
    short_description : String
},{timestamps:true})

const post = mongoose.model('Posts',postDetail);

export default post;