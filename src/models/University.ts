import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse {
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
}

export interface IUniversity extends Document {
  name: string;
  aggregation: string;
  location: string;
  contactPersonMobile: string;
  modeOfLearning: 'Online' | 'Distance' | 'Regular';
  payout: string;
  websiteUrl: string;
  courses: ICourse[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String },
  duration: { type: Number, required: true },
  totalFee: { type: Number, required: true },
  yearFee: { type: Number, required: true },
  semesterFee: { type: Number, required: true },
});

const UniversitySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    aggregation: { type: String, required: true },
    location: { type: String, required: true },
    contactPersonMobile: { type: String, required: true },
    modeOfLearning: {
      type: String,
      enum: ['Online', 'Distance', 'Regular'],
      required: true,
    },
    payout: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    courses: { type: [CourseSchema], required: true },
  },
  { timestamps: true }
);

// Clear cached model to ensure schema updates are applied during hot-reload/development
if (mongoose.models.University) {
  delete mongoose.models.University;
}

const University = mongoose.model<IUniversity>('University', UniversitySchema);

export default University;
