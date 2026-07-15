export interface Course {
  remark: any;
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
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
  universityId: string;
  universityName: string;
  courseName: string;
  specialization?: string;
  city: string;
  duration?: number;
  totalFee?: number;
  yearFee?: number;
  semesterFee?: number;
  status: string;
  createdAt: string;
}
