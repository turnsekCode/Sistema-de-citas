import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  _id: string;
  name: string;
  specialty: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  contactInfo: {
    phone: string;
    email: string;
  };
  createdAt: Date;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  }],
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);