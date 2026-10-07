import mongoose, { Schema, Document } from "mongoose";

export interface IInstituteRemarkHistory {
  remark: string;
  updatedAt: Date;
  status?: string;
  updatedBy?: string;
}

export interface IInstituteStudent extends Document {
  firstName: string;
  middleName?: string;
  lastName?: string;
  branch?: string;
  parentName?: string;
  mobile: string;
  alternateMobile?: string;
  parentEmail?: string;
  address?: string;
  dob?: string;
  gender?: string;
  course: string;
  qualification?: string;
  fatherOccupation?: string;
  institutionName?: string;
  city?: string;
  enquiredFrom?: string;
  status: string;
  counselorId?: string;
  counselorName?: string;
  counselorRole?: string;
  remark?: string;
  remarkUpdatedAt?: Date;
  remarkHistory?: IInstituteRemarkHistory[];
  courseFee?: number;
  paidAmount?: number;
  remainingAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InstituteStudentSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    parentName: { type: String, trim: true },
    mobile: { type: String, required: true, index: true, trim: true },
    alternateMobile: { type: String, trim: true },
    parentEmail: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    dob: { type: String },
    gender: { type: String },
    course: { type: String, required: true, index: true },
    qualification: { type: String, trim: true },
    fatherOccupation: { type: String, trim: true },
    institutionName: { type: String, trim: true },
    city: { type: String, trim: true },
    enquiredFrom: { type: String, trim: true },
    branch: {
      type: String,
      enum: ["Mumbra Branch", "Bhiwandi Branch", "Andheri Branch", ""],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "New Lead",
        "Active On Call",
        "Center Visit",
        "Demo / Counseling",
        "Follow-Up",
        "Batch Processing",
        "Hold",
        "Lost",
        "Admission",
      ],
      default: "New Lead",
      index: true,
    },
    counselorId: { type: String, index: true },
    counselorName: { type: String },
    counselorRole: { type: String },
    remark: { type: String },
    remarkUpdatedAt: { type: Date },
    remarkHistory: [
      {
        remark: { type: String },
        updatedAt: { type: Date, default: Date.now },
        status: { type: String },
        updatedBy: { type: String },
      },
    ],
    courseFee: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

InstituteStudentSchema.pre("save", function (this: any) {
  if (
    this.isModified("remark") &&
    this.remark &&
    typeof this.remark === "string" &&
    this.remark.trim() !== ""
  ) {
    this.remarkUpdatedAt = new Date();
  }
});

if (mongoose.models.InstituteStudent) {
  delete mongoose.models.InstituteStudent;
}

const InstituteStudent = mongoose.model<IInstituteStudent>(
  "InstituteStudent",
  InstituteStudentSchema,
);

export default InstituteStudent;
