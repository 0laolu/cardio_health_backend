import nodemailer from "nodemailer"
import dotenv from "dotenv"


dotenv.config()

const sendEmail = (toEmail) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    })
  
  
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: toEmail,
      subject: "Nodemailer Project Newsletter Subscription",
      text: "Thank you for subscribing to our newsletter"
    }
  
    transporter.sendMail(mailOptions, (err, info) => {
      if(err) {
        console.log("Error Occurred: " + err)
        reject(err)
      } else {
        console.log("Email sent successfully")
        resolve(info)
      }
    })
  })

}

export default sendEmail














// creating a transporter using the sender email
// const transporter = nodemailer.createTransport({
//     host: "smtp.mandrillapp.com", 
//     port: 587, 
//     auth: {
//         user: process.env.USER,
//         pass: process.env.PASS
//     }
// })

// export const sendNewsletter = () => {
//     return new Promise((resolve, reject) => {
//       fetchSubscribers()
//         .then(subscribers => {
//           const emailPromises = subscribers.map(email => {
//             const mailOptions = {
//               from: 'termbuddy71@gmail.com', 
//               to: email,                      
//               subject: "Thank you for Subscribing!",               
//               text: "This is the beginning of our weekly blogs on news and details about your health",             
//             };
//             // Send the email
//             return transporter.sendMail(mailOptions);
//           });
          
//           // Resolve once all emails have been sent
//           Promise.all(emailPromises)
//             .then(resolve)
//             .catch(reject);
//         })
//         .catch(reject);
//     });
//   };