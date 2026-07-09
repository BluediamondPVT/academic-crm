import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  aggregation: string;
  location: string;
  contactPersonMobile: string;
  modeOfLearning: 'Online' | 'Distance' | 'Regular';
  payout: string;
  websiteUrl: string;
  courses: string[];
  createdAt: Date;
  updatedAt: Date;
}

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
    courses: { type: [String], required: true },
  },
  { timestamps: true }
);

const University = mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);

export default University;
