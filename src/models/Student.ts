import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  phoneNumber: string;
  universityId: string;
  universityName: string;
  courseName: string;
  specialization?: string;
  duration?: number;
  totalFee?: number;
  yearFee?: number;
  semesterFee?: number;
  status: string;
  counselorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    universityId: { type: String, required: true },
    universityName: { type: String, required: true },
    courseName: { type: String, required: true },
    specialization: { type: String },
    duration: { type: Number },
    totalFee: { type: Number },
    yearFee: { type: Number },
    semesterFee: { type: Number },
    status: {
      type: String,
      enum: ['Lead', 'Enrolled', 'In Progress', 'Completed'],
      default: 'Enrolled',
    },
    counselorName: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.Student) {
  delete mongoose.models.Student;
}

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
