import mongoose, { Schema, Document } from 'mongoose';

export interface IRemarkHistory {
  remark: string;
  updatedAt: Date;
  status?: string;
}

export interface IStudent extends Document {
  name: string;
  phoneNumber: string;
  email?: string;
  remark?:string;
  remarkUpdatedAt?: Date;
  remarkHistory?: IRemarkHistory[];
  admissionRemark?: string;
  admissionRemarkUpdatedAt?: Date;
  preAdmissionRemark?: string;
  preAdmissionStatus?: string;
  universityId: string;
  universityName: string;
  courseName: string;
  specialization?: string;
  duration?: number;
  totalFee?: number;
  yearFee?: number;
  semesterFee?: number;
  payoutPercentage?: number;
  totalPaid?: number;
  remainingFee?: number;
  payments?: {
    paymentType: string;
    amount: number;
    paymentMode: string;
    nextDueDate?: Date;
    date: Date;
    remark?: string;
  }[];
  status: string;
  counselorId?: string;
  counselorName?: string;
  city: string;
  session?: string;
  nextDueDate?: Date;
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
    remarkHistory: [
      {
        remark: { type: String },
        updatedAt: { type: Date, default: Date.now },
        status: { type: String }
      }
    ],
    admissionRemark: { type: String },
    admissionRemarkUpdatedAt: { type: Date },
    preAdmissionRemark: { type: String },
    preAdmissionStatus: { type: String },
    universityId: { type: String, required: true },
    universityName: { type: String, required: true },
    courseName: { type: String, required: true },
    specialization: { type: String },
    duration: { type: Number },
    totalFee: { type: Number, default: 0 },
    yearFee: { type: Number }, 
    semesterFee: { type: Number },
    payoutPercentage: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    remainingFee: { type: Number, default: 0 },
    payments: [
      {
        paymentType: { type: String },
        amount: { type: Number },
        paymentMode: { type: String },
        nextDueDate: { type: Date },
        date: { type: Date, default: Date.now },
        remark: { type: String }
      }
    ],
    status: {
      type: String,
      enum: ['New Lead', 'Active On Call', 'Visit', 'Online Counseling', 'Follow-Up', 'Processing', 'Hold', 'Lost', 'Admission'],
      default: 'New Lead',
    },
    counselorId: { type: String, index: true },
    counselorName: { type: String },
    city:{ type: String, required:true },
    session: { type: String },
    nextDueDate: { type: Date },
  },
  { timestamps: true }
);

StudentSchema.pre('save', function (this: any) {
  if (this.isModified('remark') && this.remark && typeof this.remark === 'string' && this.remark.trim() !== '') {
    this.remarkUpdatedAt = new Date();
  }
});

if (mongoose.models.Student) {
  delete mongoose.models.Student;
}

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
