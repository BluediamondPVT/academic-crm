import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse {
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
  payoutPercentage?: number;
}

export interface IAggregator {
  name: string;
  email?: string;
  number?: string;
  location?: string;
  whatsapp?: string;
}

// Alias for backward compatibility
export type IAggregation = IAggregator;

export interface IUniversity extends Document {
  name: string;
  aggregator?: IAggregator | string;
  aggregation?: IAggregator | string;
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
  payoutPercentage: { type: Number, required: true, default: 0 },
});

const UniversitySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    aggregator: { type: Schema.Types.Mixed },
    aggregation: { type: Schema.Types.Mixed },
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
