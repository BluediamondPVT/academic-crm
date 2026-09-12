"use client";

import { useEffect, useState, useRef } from "react";
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
  AlertCircle,
  Send,
  Flag,
  Percent,
  PlayCircle,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import TaskProgressBar from "@/components/tasks/TaskProgressBar";

interface Message {
  _id?: string;
  sender: string;
  senderRole: string;
  senderName: string;
  text: string;
  createdAt: string;
}

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
  messages?: Message[];
  createdAt: string;
  updatedAt?: string;
}

export default function AdminTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUpdateText, setNewUpdateText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const timelineEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !newUpdateText.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newUpdateText.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setTask((prev) => (prev ? { ...prev, messages: data.data } : null));
        setNewUpdateText("");
        setTimeout(() => {
          timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        alert(data.error || "Failed to send update");
      }
    } catch (err) {
      alert("Error sending update");
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    if (!taskId) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setTask((prev) => (prev ? { 
          ...prev, 
          status: newStatus,
          updatedAt: data.data?.updatedAt || new Date().toISOString()
        } : null));
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-xs font-medium">Loading task timeline...</p>
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

  const startDateStr = new Date(task.createdAt).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="space-y-6 font-sans text-gray-800 max-w-4xl mx-auto pb-16">
      {/* 🟢 TOP BAR & NAVIGATION */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/tasks"
          className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 shadow-xs transition-all inline-flex items-center gap-2 text-xs font-bold"
        >
          <ArrowLeft size={16} />
          <span>Back to Tasks</span>
        </Link>

        {/* Status Dropdown / Controls for Admin */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">
            Status:
          </span>
          <select
            value={task.status}
            disabled={updatingStatus}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
              task.status === "COMPLETED"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : task.status === "IN_PROGRESS"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <option value="PENDING">● PENDING</option>
            <option value="IN_PROGRESS">● IN PROGRESS</option>
            <option value="COMPLETED">● COMPLETED</option>
          </select>
        </div>
      </div>

      {/* 🟢 TOP CARD: TASK NAME & DETAILS (As specified in handwritten sketch) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        {/* Task Title with Short ID */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
              {shortId}
            </span>
            <span className="text-[11px] font-semibold text-gray-400">
              Assigned to: <strong className="text-slate-700">{task.assignee?.name || "Team Member"}</strong> ({task.assignee?.role || "Staff"})
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#112a46] tracking-tight">
            {task.title}
          </h1>
        </div>

        {/* 4 Key Details Cards: Start Date, Due Date, Priority, Percentage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
          {/* 1. Start Date */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Calendar size={13} className="text-indigo-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Start Date</span>
            </div>
            <span className="text-xs font-bold text-slate-800 truncate" title={startDateStr}>
              {startDateStr}
            </span>
          </div>

          {/* 2. Due Date */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Clock size={13} className="text-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Due Date</span>
            </div>
            <span className="text-xs font-bold text-slate-800 truncate" title={dueDateStr}>
              {dueDateStr}
            </span>
          </div>

          {/* 3. Priority */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Flag size={13} className="text-rose-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Priority</span>
            </div>
            <div>
              <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                task.priority === "HIGH"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : task.priority === "LOW"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {task.priority || "MEDIUM"}
              </span>
            </div>
          </div>

          {/* 4. Percentage Progress */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Percent size={13} className="text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Progress</span>
            </div>
            <div className="mt-0.5">
              <TaskProgressBar task={task} size="sm" showLabel={false} />
            </div>
          </div>
        </div>

        {/* 🌟 Glowing Neon Capsule Progress Bar (Matching Reference Image) */}
        <div className="pt-3 border-t border-gray-100/80">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 shadow-lg">
            <TaskProgressBar task={task} size="md" showLabel={true} />
          </div>
        </div>
      </div>

      {/* 🟢 TIMELINE SECTION (Matching Sketch: "Task Start" Header -> Timeline -> "New Update" Box) */}
      <div className="space-y-6">
        {/* Milestone Header: Task Start */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs shadow-xs tracking-wide">
            <PlayCircle size={16} className="text-indigo-600" />
            <span>Task Start</span>
            <span className="text-[10px] font-semibold text-indigo-400">
              • {new Date(task.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* 🟢 Central Vertical Timeline (Straight Center Line: Admin on Right, Receiver on Left) */}
        <div className="relative py-4">
          {/* Central Straight Line */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 -translate-x-1/2 border-r-2 border-dashed border-indigo-200" />

          <div className="space-y-6">
            {/* Node 1: Initial Task Instructions from Super Admin -> RIGHT SIDE */}
            <div className="relative flex flex-col md:flex-row md:justify-end items-start group">
              {/* Timeline Center Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100 shadow-xs z-10" />

              {/* Card on Right (Admin) */}
              <div className="w-full pl-12 md:pl-0 md:w-[calc(50%-28px)] md:ml-auto">
                <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs hover:shadow-md transition-shadow relative">
                  {/* Arrow pointing to center line */}
                  <div className="hidden md:block absolute -left-2 top-6 w-3.5 h-3.5 bg-white border-b border-l border-indigo-100 rotate-45" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        SA
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800">
                          {task.assignedBy?.name || "Super Admin"}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1.5">
                          SUPER ADMIN
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(task.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                      Initial Task Instructions:
                    </p>
                    <div className="p-3.5 bg-slate-50/90 rounded-xl text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed border border-slate-100">
                      {task.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Node 2, 3, etc: Timeline Updates / Messages (Admin on Right, Receiver on Left) */}
            {task.messages && task.messages.length > 0 && (
              task.messages.map((msg, idx) => {
                const isAdmin = msg.senderRole === "ADMIN";

                return (
                  <div 
                    key={msg._id || idx} 
                    className={`relative flex flex-col md:flex-row items-start group ${
                      isAdmin ? "md:justify-end" : "md:justify-start"
                    }`}
                  >
                    {/* Timeline Center Dot */}
                    <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full ring-4 shadow-xs z-10 ${
                      isAdmin 
                        ? "bg-indigo-600 ring-indigo-100" 
                        : "bg-[#008069] ring-emerald-100"
                    }`} />

                    {/* Card: Left if Receiver (Staff/Counselor), Right if Admin */}
                    <div className={`w-full pl-12 md:pl-0 md:w-[calc(50%-28px)] ${
                      isAdmin ? "md:ml-auto" : "md:mr-auto"
                    }`}>
                      <div className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-xs transition-shadow hover:shadow-md relative ${
                        isAdmin ? "border-indigo-100" : "border-emerald-100"
                      }`}>
                        {/* Arrow pointing to center line */}
                        {isAdmin ? (
                          <div className="hidden md:block absolute -left-2 top-6 w-3.5 h-3.5 bg-white border-b border-l border-indigo-100 rotate-45" />
                        ) : (
                          <div className="hidden md:block absolute -right-2 top-6 w-3.5 h-3.5 bg-white border-t border-r border-emerald-100 rotate-45" />
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-100 pb-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                              isAdmin ? "bg-indigo-600" : "bg-[#008069]"
                            }`}>
                              {msg.senderName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800">
                                {msg.senderName}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                isAdmin
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}>
                                {msg.senderRole}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(msg.createdAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={timelineEndRef} />
          </div>
        </div>

        {/* 🟢 BOTTOM SECTION: "New Update" Box (Matching Handwritten Sketch) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              New Update
            </h3>
          </div>

          <form onSubmit={handleSendUpdate} className="space-y-3">
            <textarea
              rows={3}
              value={newUpdateText}
              onChange={(e) => setNewUpdateText(e.target.value)}
              placeholder="Write a new update, instruction, or progress note for this task..."
              className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium resize-none"
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSending || !newUpdateText.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-40 active:scale-98"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
