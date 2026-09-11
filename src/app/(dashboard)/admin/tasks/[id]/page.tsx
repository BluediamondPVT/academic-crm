import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TaskDetailPage() {
  return (
    <div className="p-6">
      <Link
        href="/admin/tasks"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-2xs"
      >
        <ArrowLeft size={14} />
        <span>Back to Tasks</span>
      </Link>
      
      {/* Blank page for now */}
      <div className="mt-6"></div>
    </div>
  );
}

/*
// ==========================================
// PREVIOUS DETAILED CODE KEPT COMMENTED FOR FUTURE:
// ==========================================
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  User, 
  ClipboardList, 
  Loader2,
  AlertCircle
} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignee?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedBy?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export function TaskDetailPreviousCode() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) return;
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tasks/${taskId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setTask(data.data);
      } else {
        setError(data.error || "Failed to load task");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-xs font-medium">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl mb-4 text-xs font-bold flex items-center justify-center gap-2">
          <AlertCircle size={18} />
          <span>{error || "Task not found"}</span>
        </div>
        <Link
          href="/admin/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back to Tasks</span>
        </Link>
      </div>
    );
  }

  const shortId = `#${task._id.slice(-5).toUpperCase()}`;

  return (
    <div className="space-y-6 font-sans text-gray-800 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tasks"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 shadow-xs transition-all"
            title="Back to Tasks"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {shortId}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                task.status === "COMPLETED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : task.status === "IN_PROGRESS"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {task.status.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#112a46] mt-1">
              {task.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Holder (Assignee)</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs">
              {task.assignee?.name ? task.assignee.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{task.assignee?.name || "Unassigned"}</p>
              <p className="text-xs text-slate-500 font-medium">{task.assignee?.role || "Staff"} • {task.assignee?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Start Time</p>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Clock size={18} className="text-indigo-600" />
            <span className="text-sm font-bold">
              {new Date(task.createdAt).toLocaleString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">End Time / Due Date</p>
          <div className="flex items-center gap-2.5 text-slate-700">
            <Calendar size={18} className="text-indigo-600" />
            <span className="text-sm font-bold">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : task.status === "COMPLETED" && task.updatedAt
                ? new Date(task.updatedAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-[11px]">
          Task Instructions & Description
        </h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
          {task.description}
        </div>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
        <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-700">Task Details & Work Log</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Detailed logs, subtasks, and specific metrics for this task will be configured here in future updates.
        </p>
      </div>
    </div>
  );
}
*/
