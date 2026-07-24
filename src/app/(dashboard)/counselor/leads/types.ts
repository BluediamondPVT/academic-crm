export interface Course {
  remark: any;
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
  payoutPercentage?: number;
}

export interface University {
  _id: string;
  name: string;
  aggregation: string;
  location: string;
  modeOfLearning: string;
  courses: Course[];
}

export interface RemarkHistoryEntry {
  remark: string;
  updatedAt: string;
  status?: string;
}

export interface StudentRecord {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  remark?: string;
  remarkUpdatedAt?: string;
  remarkHistory?: RemarkHistoryEntry[];
  admissionRemark?: string;
  admissionRemarkUpdatedAt?: string;
  preAdmissionRemark?: string;
  preAdmissionStatus?: string;
  universityId: string;
  universityName: string;
  courseName: string;
  specialization?: string;
  city: string;
  session?: string;
  nextDueDate?: string;
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
    nextDueDate?: string;
    date: string;
    remark?: string;
  }[];
  status: string;
  counselorId?: string;
  counselorName?: string;
  createdAt: string;
  updatedAt?: string;
}
