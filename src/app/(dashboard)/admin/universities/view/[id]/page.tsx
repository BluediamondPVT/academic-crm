'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, MapPin, Phone, Globe, DollarSign, GraduationCap, Award, 
  ArrowLeft, Edit2, ExternalLink, Sparkles, CheckCircle2, Calendar
} from 'lucide-react';

interface Course {
  name: string;
  specialization?: string;
  duration: number;
  totalFee: number;
  yearFee: number;
  semesterFee: number;
}

interface UniversityDetails {
  _id: string;
  name: string;
  aggregation: string;
  location: string;
  contactPersonMobile: string;
  modeOfLearning: 'Online' | 'Distance' | 'Regular';
  payout: string;
  websiteUrl: string;
  courses: Course[];
  createdAt?: string;
  updatedAt?: string;
}

export default function ViewUniversityPage() {
  const params = useParams();
  const id = params?.id as string;

  const [university, setUniversity] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUniversityDetails(id);
    }
  }, [id]);

  const fetchUniversityDetails = async (universityId: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/universities/${universityId}`);
      if (!res.ok) {
        throw new Error('Failed to load university details');
      }
      const data = await res.json();
      setUniversity(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching university');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#f8f9fc]">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-[#112a46] rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-gray-600 animate-pulse">
          Loading university profile...
        </p>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#f8f9fc] p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-md text-center">
          <p className="font-bold text-lg mb-2">Unable to load university</p>
          <p className="text-sm mb-5">{error || 'University not found'}</p>
          <Link
            href="/admin/universities"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#112a46] text-white rounded-xl text-sm font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f7fc] to-[#f8f9fc] p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/admin/universities"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-gray-600 hover:text-[#112a46] text-sm font-semibold shadow-sm border border-gray-200/80 backdrop-blur-md transition-all group w-fit"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Universities</span>
          </Link>

          <div className="flex items-center gap-3">
            {university.websiteUrl && (
              <a
                href={
                  university.websiteUrl.startsWith('http')
                    ? university.websiteUrl
                    : `https://${university.websiteUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold border border-gray-200 shadow-sm transition-all"
              >
                <Globe className="h-4 w-4 text-gray-500" />
                <span>Visit Website</span>
                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              </a>
            )}

            <Link
              href={`/admin/universities/edit/${university._id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#112a46] hover:bg-[#1a3d66] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit University</span>
            </Link>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-3xl p-7 md:p-8 shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#112a46] to-[#1e40af] text-white flex items-center justify-center shadow-md shrink-0">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      university.modeOfLearning === 'Regular'
                        ? 'bg-green-100 text-green-800'
                        : university.modeOfLearning === 'Online'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {university.modeOfLearning} Mode
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    <Award className="h-3.5 w-3.5" />
                    {university.aggregation}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-[#112a46] tracking-tight">
                  {university.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-2.5 text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {university.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {university.contactPersonMobile}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* General Information Card */}
          <div className="bg-white rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building className="h-5 w-5 text-[#112a46]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#112a46]">Institutional Overview</h3>
                <p className="text-xs text-gray-500">Accreditation & contact records</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  University Name
                </p>
                <p className="text-base font-bold text-[#112a46]">{university.name}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Aggregation / Affiliation
                </p>
                <p className="text-sm font-semibold text-gray-800">{university.aggregation}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Location Address
                </p>
                <p className="text-sm font-semibold text-gray-800">{university.location}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Contact Mobile Number
                </p>
                <p className="text-sm font-semibold text-[#112a46]">{university.contactPersonMobile}</p>
              </div>
            </div>
          </div>

          {/* Academic & Financial Setup */}
          <div className="bg-white rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#112a46]">Financial & Operations</h3>
                <p className="text-xs text-gray-500">Commission terms & web presence</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Mode of Learning
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-gray-100 text-gray-800">
                  {university.modeOfLearning}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Commission Payout Structure
                </p>
                <p className="text-base font-bold text-emerald-700 bg-emerald-50/60 px-3.5 py-2 rounded-xl border border-emerald-100 inline-block">
                  {university.payout}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Official Website
                </p>
                <a
                  href={
                    university.websiteUrl.startsWith('http')
                      ? university.websiteUrl
                      : `https://${university.websiteUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
                >
                  <span>{university.websiteUrl}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Offered Courses Card */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_20px_-4px_rgba(17,42,70,0.08)] border border-gray-100/80 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-indigo-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#112a46]">Offered Courses & Fee Structure</h3>
                <p className="text-xs text-gray-500">Detailed overview of degrees, duration, and fee breakdowns</p>
              </div>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold">
              {university.courses.length} {university.courses.length === 1 ? 'Program' : 'Programs'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200/80">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#112a46] text-white">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs">Course & Specialization</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-center">Duration</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-right bg-[#112a46]/95">Total Fee</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-right bg-[#10b981]/15 text-emerald-100">Per Year Fee</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-xs text-right bg-[#3b82f6]/15 text-blue-100">Semester Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {university.courses && university.courses.length > 0 ? (
                  university.courses.map((c: any, index: number) => {
                    const course = typeof c === 'string' ? {
                      name: c,
                      specialization: '',
                      duration: 3,
                      totalFee: 0,
                      yearFee: 0,
                      semesterFee: 0
                    } : c;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#112a46] text-base">{course.name}</div>
                          {course.specialization && (
                            <div className="text-xs text-gray-500 mt-0.5 font-medium">{course.specialization}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-gray-700">
                          {course.duration} {course.duration === 1 ? 'Year' : 'Years'}
                        </td>
                        <td className="px-5 py-4 text-right font-extrabold text-[#112a46] text-base bg-gray-50/40">
                          ₹{course.totalFee ? course.totalFee.toLocaleString('en-IN') : '0'}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-emerald-700 bg-emerald-50/20">
                          ₹{course.yearFee ? course.yearFee.toLocaleString('en-IN') : '0'}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-blue-700 bg-blue-50/20">
                          ₹{course.semesterFee ? course.semesterFee.toLocaleString('en-IN') : '0'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400 font-medium italic">
                      No courses listed for this university.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
