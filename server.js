import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import Mailchimp from 'mailchimp-api-v3'
import fs from 'fs'
import cloudinary from './cloudinary/cloudinary.js'
import { upload } from './cloudinary/multerConfig.js'
import { mailchimpApiKey, audienceId } from './mailchimpConfig/mailchimp.js'

// importing the model
import Blog from './models/blog.js'

dotenv.config()

// creating the maichimp app
const mailchimp = new Mailchimp(mailchimpApiKey)

// creating the express app
const app = express()


//middleware to parse JSON data
app.use(express.json())

// app.use(express.urlencoded({ extended: true }))

// setting up cors
app.use(cors())

const port = process.env.PORT || 3000

// connecting to MongoDB
mongoose.connect(process.env.DB_URI)
    .then(() => {
        // listening for requests after the server is connected to the db
        app.listen(port)
        console.log("Connected to MongoDB")
    }).catch(err => console.log(err))



// sending email of new subscriber to mailchimp
app.post("/newsletter/subscribe", (req, res) => {
    const { email } = req.body

    // checking if the email exists
    if(!email) {
        res.status(400).json({ message: "Email is required" })
    }

    mailchimp.post(`lists/${audienceId}/members`, {
        email_address: email,
        status: "subscribed"
    })
    .then(result => res.json(result))
    .catch(err => {
        console.log(err.response.body);  // log Mailchimp's detailed error response
        res.status(500).json({ message: "Failed to subscribe", error: err.response.body });
    })

})

// saving new blog data in the db
app.post('/all-blogs', upload.single('poster'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log(req.body)

    cloudinary.uploader.upload(req.file.path)
        .then(result => {
            const blog = new Blog({
                ...req.body,
                blogImageUrl: result.secure_url
            })

            blog.save()
                .then(result => {
                    // delete the file from uploads folder after uploaded to cloudinary
                    fs.unlink(req.file.path, err => {
                       if(err) console.error('Error: Failed to delete file', err)
                    })
                    res.json(result)
                    
                }).catch(err => console.log(err))
        })
        .catch(err => {
            res.status(500).res.json({ error: 'Failed to save data in the database' })
            console.error('Error saving data in the database', err)
        })

    
})

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
    




























// import express from 'express';
// import cors from 'cors';
// import { createTransport } from 'nodemailer';
// import { connect, Schema, model } from 'mongoose';

// const app = express();
// const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
// app.use(express.json());

// Connect to MongoDB
// connect('mongodb://127.0.0.1:27017/myNewsletter')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema and model for subscribers
// const subscriberSchema = new Schema({
//     email: { type: String, required: true }
// });

// const Subscriber = model('Subscriber', subscriberSchema);

// Nodemailer transporter setup
// const transporter = createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'testemail@gmail.com',
//         pass: 'password'
//     }
// });

// Route to handle subscription
// app.post('/api/subscribe', async (req, res) => {
//     const { email } = req.body;
//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }

//     try {
//         const newSubscriber = new Subscriber({ email });
//         await newSubscriber.save();

//         Send a confirmation email
//         const mailOptions = {
//             from: 'youremail@gmail.com',
//             to: email,
//             subject: 'Subscription Confirmation',
//             text: 'Thank you for subscribing to our newsletter!'
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).json({ message: 'Subscription failed. Please try again.' });
//             } else {
//                 console.log('Email sent: ' + info.response);
//                 return res.status(200).json({ message: 'Subscription successful! Thank you.' });
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Subscription failed. Please try again.' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
