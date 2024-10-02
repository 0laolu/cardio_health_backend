import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
// import Mailchimp from 'mailchimp-api-v3'
// import fs from 'fs'
import { v2 as cloudinary } from "cloudinary"
import { upload } from './cloudinary/multerConfig.js'
import sendEmail from './mailchimpConfig/emailSender.js'
// import { mailchimpApiKey, audienceId } from './mailchimpConfig/mailchimp.js'
// import { sendNewsletter } from './mailchimpConfig/emailSender.js'

// importing the model
import Blog from './models/blog.js'

dotenv.config()

// creating the maichimp app
// const mailchimp = new Mailchimp(mailchimpApiKey)

// creating the express app
const app = express()


//middleware to parse JSON data
app.use(express.json())

// app.use(express.urlencoded({ extended: true }))

// setting up cors
app.use(cors())

const port = process.env.PORT || 5000

// connecting to MongoDB
mongoose.connect(process.env.DB_URI)
    .then(() => {
        // listening for requests after the server is connected to the db
        app.listen(port, () => {
            console.log(`server is running on ${port}`)
        })
        console.log("Connected to MongoDB")
    }).catch(err => console.log(err))



// sending email of new subscriber to mailchimp
app.post("/newsletter/subscribe", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    sendEmail(email)
        .then(() => {
            res.status(200).json({ message: "Email successfully submitted" })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Failed to submit email" })
        })

});

    // mailchimp.post(`lists/${audienceId}/members`, {
    //     email_address: email,
    //     status: "subscribed"
    // })
    // .then(result => {
    //     res.json(result);
        
    //     // Call sendNewsletter after subscription
    //     sendNewsletter()
    //       .then(() => {
    //         console.log(`Newsletter sent to subscribers`);
    //       })
    //       .catch(error => {
    //         console.error(`Error sending newsletter to subscribers:`, error);
    //       });
    // })
    // .catch(err => {
    //     console.log(err.response.body);
    //     res.status(500).json({ message: "Failed to subscribe", error: err.response.body });
    // });





// saving new blog data in the db
app.post('/all-blogs', upload.single('poster'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Logging the file info to see what Cloudinary returns
    console.log(req.file); // Cloudinary returns an object with secure_url among other things

    // Use req.file.path or req.file.secure_url for the Cloudinary URL
    const blog = new Blog({
        ...req.body,
        blogImageUrl: req.file.path
    });
    console.log("form data sent to the database")

    blog.save()
        .then(result => {
            res.json(result)
            console.log('form has been saved in the database')
        })
        .catch(err => res.status(500).json({ error: 'Failed to save blog' }));
});

// getting all blogs
app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.json(result)
        }).catch(err => console.log(err))
  })

// getting a single blog
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id)
        .then(result => {
            res.json(result)
        }).catch(err => console.log(err))
})

app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(200).json({ redirect: '/all-blogs' })
        }).catch(err => {
            res.status(500).json()
            console.log(err)
        })
})
    
