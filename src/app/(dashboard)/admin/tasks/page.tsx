"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Loader2, 
  Plus, 
  Users, 
  Send, 
  MessageSquare, 
  Search, 
  X, 
  Calendar, 
  AlertCircle,
  ClipboardList,
  Filter,
  ArrowRight,
  ChevronDown
} from "lucide-react";
import { ROLES } from "@/config/roles";
import TaskChatDrawer, { Message } from "@/components/tasks/TaskChatDrawer";
import TaskProgressBar from "@/components/tasks/TaskProgressBar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignee: {
    _id: string;
    name: string;
    role: string;
  };
  assignedBy: {
    _id: string;
    name: string;
  };
  messages?: Message[];
  createdAt: string;
  updatedAt?: string;
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openChatTaskId, setOpenChatTaskId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [taskId: string]: string }>({});
  const [sendingReply, setSendingReply] = useState<{ [taskId: string]: boolean }>({});

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, staffRes] = await Promise.all([
        fetch("/api/admin/tasks"),
        fetch("/api/admin/counselors"), // Fetch all team members (counselors, academic, staff)
      ]);

      const tasksData = await tasksRes.json();
      const staffData = await staffRes.json();

      if (tasksRes.ok) setTasks(tasksData.data || []);
      if (staffRes.ok) setStaffList(staffData || []);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create task");

      setSuccess("Task assigned successfully!");
      setFormData({ title: "", description: "", assigneeId: "", priority: "MEDIUM", dueDate: "" });
      setIsModalOpen(false);
      fetchData(); // Reload tasks

      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (taskId: string) => {
    const text = replyText[taskId]?.trim();
    if (!text) return;

    setSendingReply((prev) => ({ ...prev, [taskId]: true }));
    try {
      const res = await fetch(`/api/tasks/${taskId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, messages: data.data } : t))
        );
        setReplyText((prev) => ({ ...prev, [taskId]: "" }));
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (err) {
      alert("Error sending message");
    } finally {
      setSendingReply((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (task.assignee?.name && task.assignee.name.toLowerCase().includes(query)) ||
      (task.assignee?.role && task.assignee.role.toLowerCase().includes(query));

    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || (task.priority || "MEDIUM") === priorityFilter;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  // Summary counts
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter(t => t.status === "PENDING").length;
  const inProgressCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;

  const activeChatTask = tasks.find(t => t._id === openChatTaskId) || null;

  return (
    <div className="space-y-6 font-sans text-gray-800 pb-12">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-xs">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#112a46] tracking-tight">
                Task Management
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Assign tasks to team members, review progress, and communicate in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Send Task Button to trigger Modal Popup */}
        <button
          onClick={() => {
            setError("");
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 shrink-0 active:scale-98"
        >
          <Plus className="h-4 w-4" />
          <span>Send Task</span>
        </button>
      </div>

      {/* Success / Error Alerts */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-500 hover:text-emerald-700">
            <X size={16} />
          </button>
        </div>
      )}
      {error && !isModalOpen && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{totalTasks}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
            <ClipboardList size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
            <p className="text-xl font-black text-amber-600 mt-0.5">{pendingCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            <Circle size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">In Progress</p>
            <p className="text-xl font-black text-blue-600 mt-0.5">{inProgressCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <Clock size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Completed</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">{completedCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Table Search & Status Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3 bg-white">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by task name or holder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>

            {/* Priority Filter */}
            <div className="relative w-full sm:w-44">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-[11px]">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "PENDING"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("IN_PROGRESS")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "IN_PROGRESS"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "COMPLETED"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="h-7 w-7 animate-spin mb-2 text-indigo-600" />
              <p className="text-xs font-medium">Loading tasks table...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-400 text-center">
              <ClipboardList className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-700">No tasks found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                {searchQuery ? "Try refining your search query." : "Click 'Send Task' above to assign a task."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-16">ID</th>
                  <th className="py-3 px-4 min-w-[220px]">Task Name</th>
                  <th className="py-3 px-4 min-w-[170px]">Holder</th>
                  <th className="py-3 px-4 min-w-[140px]">Start Time</th>
                  <th className="py-3 px-4 min-w-[140px]">End Time</th>
                  <th className="py-3 px-4 min-w-[140px]">Due Date</th>
                  <th className="py-3 px-4 text-center w-24">Percentage</th>
                  <th className="py-3 px-4 w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map((task, idx) => {
                  const shortId = `#${task._id.slice(-5).toUpperCase()}`;
                  
                  // Start time
                  const startTimeStr = new Date(task.createdAt).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  // End time: completion time if completed, else '—'
                  const endTimeStr = (task.status === "COMPLETED" && task.updatedAt)
                    ? new Date(task.updatedAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  // Due Date
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
                    <tr 
                      key={task._id} 
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* 1: ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 text-[11px]">
                        <Link href={`/admin/tasks/${task._id}`} className="hover:underline">
                          {shortId}
                        </Link>
                      </td>

                      {/* 2: Task Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/tasks/${task._id}`}
                            className="font-bold text-slate-800 text-xs hover:text-indigo-600 transition-colors"
                          >
                            {task.title}
                          </Link>
                          <span className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {task.description}
                          </span>
                          {task.priority && (
                            <span className={`w-fit text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-1 border ${
                              task.priority === "HIGH" 
                                ? "bg-red-50 text-red-600 border-red-200" 
                                : task.priority === "LOW"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3: Holder (Assignee Name) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {task.assignee?.name ? task.assignee.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 text-xs truncate">
                              {task.assignee?.name || "Unassigned"}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {task.assignee?.role || "Staff"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4: Start Time */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                        {startTimeStr}
                      </td>

                      {/* 5: End Time */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                        {endTimeStr}
                      </td>

                      {/* 6: Due Date */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                        {dueDateStr}
                      </td>

                      {/* 7: Percentage Progress */}
                      <td className="py-3.5 px-4 text-center">
                        <TaskProgressBar task={task} size="sm" showLabel={false} />
                      </td>

                      {/* 8: Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          task.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : task.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            task.status === "COMPLETED"
                              ? "bg-emerald-500"
                              : task.status === "IN_PROGRESS"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-amber-500"
                          }`} />
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🟢 MODAL POPUP: Send Task / Assign New Task Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Assign New Task</h2>
                  <p className="text-xs text-gray-500 font-medium">Send task instructions to any team member</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Assignee Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Holder (Assignee) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.assigneeId}
                  onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium bg-white"
                >
                  <option value="">Select Team Member...</option>
                  {/* Counselors */}
                  {staffList.filter(s => s.role === ROLES.COUNSELOR).length > 0 && (
                    <optgroup label="Counselors">
                      {staffList.filter(s => s.role === ROLES.COUNSELOR).map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {/* Academic Team */}
                  {staffList.filter(s => s.role === ROLES.ACADEMIC).length > 0 && (
                    <optgroup label="Academic Team">
                      {staffList.filter(s => s.role === ROLES.ACADEMIC).map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.email})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {/* Staff / Operations */}
                  {staffList.filter(s => s.role === ROLES.STAFF).length > 0 && (
                    <optgroup label="Staff / Operations">
                      {staffList.filter(s => s.role === ROLES.STAFF).map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.email})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {/* Any Other Role */}
                  {staffList.filter(s => ![ROLES.COUNSELOR, ROLES.ACADEMIC, ROLES.STAFF].includes(s.role as any)).length > 0 && (
                    <optgroup label="Other Members">
                      {staffList.filter(s => ![ROLES.COUNSELOR, ROLES.ACADEMIC, ROLES.STAFF].includes(s.role as any)).map((o) => (
                        <option key={o._id} value={o._id}>
                          {o.name} ({o.role})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="E.g., Follow up on admissions / SEO task / Server Room Electrical Work"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>

              {/* Priority & Due Date row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Time / Due Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Task Description / Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Description / Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed instructions or message for the team member..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium resize-none"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 SLIDE-OVER DRAWER: WhatsApp Style Chat for Admin */}
      {openChatTaskId && activeChatTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setOpenChatTaskId(null)} 
          />
          {/* Slide-over panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#f0f2f5]">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#25d366] inline-block animate-pulse" />
                  Task Reverts & Chat
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {activeChatTask.title} • With <strong className="text-slate-700">{activeChatTask.assignee?.name}</strong>
                </p>
              </div>
              <button 
                onClick={() => setOpenChatTaskId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                title="Close chat panel"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-3 bg-[#efeae2] flex flex-col">
              <TaskChatDrawer
                task={activeChatTask}
                currentUserRole="ADMIN"
                replyText={replyText[activeChatTask._id] || ""}
                isSending={Boolean(sendingReply[activeChatTask._id])}
                onClose={() => setOpenChatTaskId(null)}
                onReplyTextChange={(text) => setReplyText({ ...replyText, [activeChatTask._id]: text })}
                onSendMessage={() => handleSendReply(activeChatTask._id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
