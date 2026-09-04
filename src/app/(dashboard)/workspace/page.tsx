"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Clock, Loader2, ArrowRight } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedBy: {
    name: string;
    role: string;
  };
  createdAt: string;
}

export default function WorkspacePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workspace/tasks");
      const data = await res.json();
      if (res.ok) setTasks(data.data || []);
      else setError(data.error || "Failed to fetch tasks");
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    setUpdatingTaskId(taskId);
    try {
      const res = await fetch(`/api/workspace/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Update local state
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

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
          <h1 className="text-2xl font-extrabold text-[#112a46] tracking-tight">
            My Workspace
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 font-medium">
            Manage and update tasks assigned to you by the Super Admin.
          </p>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2 text-indigo-600" />
          <p className="text-xs font-medium">Loading your tasks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Tasks */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Active Tasks ({pendingTasks.length})
            </h2>
            {pendingTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-xs border border-gray-100 text-center text-gray-400">
                <p className="text-sm font-bold">You have no active tasks!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task._id} className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-slate-800">{task.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider
                        ${task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200'}
                      `}>
                        {getStatusIcon(task.status)}
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-pre-wrap mb-4">{task.description}</p>
                    
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <p className="text-[10px] text-gray-400 font-medium">From: <strong className="text-slate-600">{task.assignedBy?.name}</strong></p>
                      <div className="flex items-center gap-2">
                        {task.status === "PENDING" && (
                          <button
                            onClick={() => updateTaskStatus(task._id, "IN_PROGRESS")}
                            disabled={updatingTaskId === task._id}
                            className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50"
                          >
                            {updatingTaskId === task._id ? 'Updating...' : 'Start Task'}
                          </button>
                        )}
                        <button
                          onClick={() => updateTaskStatus(task._id, "COMPLETED")}
                          disabled={updatingTaskId === task._id}
                          className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 disabled:opacity-50 shadow-md shadow-emerald-600/20"
                        >
                          {updatingTaskId === task._id ? 'Updating...' : (
                            <>
                              Complete <ArrowRight className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Completed Tasks ({completedTasks.length})
            </h2>
            {completedTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-xs border border-gray-100 text-center text-gray-400">
                <p className="text-sm font-bold">No completed tasks yet.</p>
              </div>
            ) : (
              <div className="space-y-3 opacity-75 hover:opacity-100 transition-opacity">
                {completedTasks.map((task) => (
                  <div key={task._id} className="bg-white rounded-2xl p-4 shadow-xs border border-emerald-100 bg-emerald-50/30">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold text-slate-800 line-through">{task.title}</h3>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2">{task.description}</p>
                    <div className="mt-2 pt-2 border-t border-emerald-100/50 flex justify-between">
                       <p className="text-[10px] text-gray-400 font-medium">From: <strong className="text-slate-600">{task.assignedBy?.name}</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
