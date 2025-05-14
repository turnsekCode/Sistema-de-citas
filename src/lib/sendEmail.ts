import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendAppointmentEmail(to: string, subject: string, data: any) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `
        <div>
          <h2>${subject}</h2>
          <p>Appointment ID: ${data.appointmentId}</p>
          <p>Date: ${new Date(data.date).toLocaleString()}</p>
          <p>Doctor: ${data.doctor.name}</p>
          <p>Reason: ${data.reason}</p>
          ${data.status ? `<p>Status: ${data.status}</p>` : ''}
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}