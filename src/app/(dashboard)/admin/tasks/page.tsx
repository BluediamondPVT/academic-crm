"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Clock, Loader2, Plus, Users, Send } from "lucide-react";
import { ROLES } from "@/config/roles";

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
  assignee: {
    _id: string;
    name: string;
    role: string;
  };
  assignedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "MEDIUM",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, staffRes] = await Promise.all([
        fetch("/api/admin/tasks"),
        fetch(`/api/admin/counselors?role=${ROLES.STAFF}`), // Using existing staff API to get STAFF only
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
      setFormData({ title: "", description: "", assigneeId: "", priority: "MEDIUM" });
      fetchData(); // Reload tasks

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === 'IN_PROGRESS') return <Clock className="h-4 w-4 text-amber-500" />;
    return <Circle className="h-4 w-4 text-gray-300" />;
  };

  return (
    <div className="space-y-6 font-sans text-gray-800 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#112a46] tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-7 w-7 text-indigo-600" />
            Task Management
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">
            Assign tasks to operational team members and track their progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Task Form */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 h-fit">
          <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 mb-4">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Assign New Task</h2>
              <p className="text-[11px] text-gray-400 font-medium">Send a task to a staff member</p>
            </div>
          </div>

          {error && <div className="p-2 mb-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{error}</div>}
          {success && <div className="p-2 mb-3 bg-emerald-50 text-emerald-600 text-xs rounded-xl font-bold">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Assignee (Staff)
              </label>
              <select
                required
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              >
                <option value="">Select Staff Member...</option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} ({staff.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Task Title
              </label>
              <input
                required
                type="text"
                placeholder="E.g., Update SEO Meta tags"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Description / Message
              </label>
              <textarea
                required
                rows={4}
                placeholder="Detailed instructions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-70"
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
          </form>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mb-2 text-indigo-600" />
              <p className="text-xs font-medium">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-gray-400 text-center">
              <CheckCircle2 className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-700">No tasks assigned yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">
                Use the form to assign a new task to a staff member.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task._id} className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{task.description}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider
                      ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-slate-50 text-slate-700 border-slate-200'}
                    `}>
                      {getStatusIcon(task.status)}
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Assigned to: <strong className="text-slate-700">{task.assignee?.name}</strong></span>
                    </div>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
