import nodemailer from "nodemailer"
import dotenv from "dotenv"

import { fetchSubscribers } from "./mailchimpService.js"


dotenv.config()
// creating a transporter using the sender email
const transporter = nodemailer.createTransport({
    host: "smtp.mandrillapp.com", 
    port: 587, 
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})

export const sendNewsletter = () => {
    return new Promise((resolve, reject) => {
      fetchSubscribers()
        .then(subscribers => {
          const emailPromises = subscribers.map(email => {
            const mailOptions = {
              from: 'termbuddy71@gmail.comw', 
              to: email,                      
              subject: "Thank you for Subscribing!",               
              text: "This is the beginning of our weekly blogs on news and details about your health",             
            };
            // Send the email
            return transporter.sendMail(mailOptions);
          });
          
          // Resolve once all emails have been sent
          Promise.all(emailPromises)
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  };