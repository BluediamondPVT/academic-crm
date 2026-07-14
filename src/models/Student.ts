import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  phoneNumber: string;
  email?: string;
  remark?:string;
  remarkUpdatedAt?: Date;
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
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email:{type:String},
    remark:{type:String},
    remarkUpdatedAt: { type: Date },
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
      enum: ['Active On Call', 'Visit', 'Online Counseling', 'Hold', 'Lost', 'Admission'],
      default: 'Active On Call',
    },
    counselorName: { type: String },
    city:{ type: String, required:true },
  },
  { timestamps: true }
);

StudentSchema.pre('save', function (this: any, next) {
  if (this.isModified('remark') && this.remark && typeof this.remark === 'string' && this.remark.trim() !== '') {
    this.remarkUpdatedAt = new Date();
  }
  next();
});

if (mongoose.models.Student) {
  delete mongoose.models.Student;
}

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
