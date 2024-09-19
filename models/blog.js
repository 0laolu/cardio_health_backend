import mongoose, { Schema } from "mongoose";


// creating a Schema
const blogSchema = new Schema({
    blogImageUrl: {
        type: String,
        required: true
    }, 
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    }, 
    body: {
        type: String,
        required: true
    },
    authorImageUrl: {
        type: String
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true })

// creating the model
const Blog = mongoose.model("Blog", blogSchema)

// exporting the model
export default Blog;