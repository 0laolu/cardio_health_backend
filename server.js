import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { upload } from './cloudinary/multerConfig.js'
import sendEmail from './mailchimpConfig/emailSender.js'

// importing the Subscriber model
import Subscriber from './models/subscriber.js'

// importing the Blog model
import Blog from './models/blog.js'

dotenv.config()


// creating the express app
const app = express()


//middleware to parse JSON data
app.use(express.json())

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

    Subscriber.findOne({ email })
        .then(existingSubscriber => {
            if(existingSubscriber) {
                return res.status(400).json({ message: "Subscriber already exists" })
            }

            sendEmail(email)
                .then(() => {
                    const newSubscriber = new Subscriber({ email })
                    newSubscriber.save()
                        .then(result => {
                            res.status(200).json({ message: "Email successfully submitted" })
                        }).catch(err => {
                            res.status(500).json({ message:  "Failed to save email"})
                            console.log(err)
                        })
                }).catch(err => {
                    res.status(500).json({ message: "Failed to send appreciation message" })
                })
        }).catch(err => {
            res.status(500).json({ message: "Something went wrong" })
            console.log(err.message)
        })

});

app.get("/newsletter/subscribe", (req, res) => {
    Subscriber.find()
        .then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.status(500).json({ message: "Failed to fetch subscribers" })
            console.log(err)
        })
})


app.post('/newsletter/unsubscribe', (req, res) => {


    const { email } = req.body

    if(!email) {
        res.status(400).json({ message: "Email is required" })
    }

    Subscriber.findOne({ email })
        .then(existingSubscriber => {
            if(!existingSubscriber) {
                return res.status(400).json({ message: "Email not subscribed" })
            }

            Subscriber.findOneAndDelete({ email })
                .then(result => {
                    res.status(200).json({ message: "Email successfully unsubscribed" })

                })
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to unsubscribe email" })
            console.log(err)
        })
    
})


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

// updating parts of a blog
app.patch('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.status(500).json()
            console.log(err)
        })
})


// deleting a blog
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(200).json({ redirect: '/all-blogs' })
        }).catch(err => {
            res.status(500).json()
            console.log(err)
        })
})
    
