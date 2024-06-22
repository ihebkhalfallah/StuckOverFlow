// services/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'reclamationpidev@outlook.com', 
    pass: 'esprit1234'        
  }
});

export function sendEmailReclamation(reclamation,user) {
  const mailOptions = {
    from: 'reclamationpidev@outlook.com',
    to:user.email,
    subject: 'About Your Reclamation',
    html: `
      <h1>Bonjour ${user.name},</h1>
      <p>Reclamation : ${reclamation.title}</p>
      <p>${reclamation.description}</p>
    
      <p>Merci de votre confiance et à très bientôt !</p>
    `};
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}
