import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generateAppointmentPdf(appointment: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  
  const { width, height } = page.getSize();
  const fontSize = 20;
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  page.drawText('Medical Appointment Details', {
    x: 50,
    y: height - 50,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Appointment ID: ${appointment._id}`, {
    x: 50,
    y: height - 100,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Patient: ${appointment.patient.name}`, {
    x: 50,
    y: height - 130,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Doctor: Dr. ${appointment.doctor.name} (${appointment.doctor.specialty})`, {
    x: 50,
    y: height - 160,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Date: ${new Date(appointment.date).toLocaleString()}`, {
    x: 50,
    y: height - 190,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Reason: ${appointment.reason}`, {
    x: 50,
    y: height - 220,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Status: ${appointment.status}`, {
    x: 50,
    y: height - 250,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  
  if (appointment.notes) {
    page.drawText(`Notes: ${appointment.notes}`, {
      x: 50,
      y: height - 280,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
  }
  
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}