"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowLeft, 
  CheckCheck,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Filter
} from "lucide-react";

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
  assignedBy: {
    _id?: string;
    name: string;
    role: string;
  };
  messages?: Message[];
  createdAt: string;
}

export default function WorkspacePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTaskId, tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workspace/tasks");
      const data = await res.json();
      if (res.ok) {
        const fetchedTasks: Task[] = data.data || [];
        setTasks(fetchedTasks);
        if (fetchedTasks.length > 0 && !selectedTaskId) {
          setSelectedTaskId(fetchedTasks[0]._id);
        }
      } else {
        setError(data.error || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTaskId) return;
    const text = replyText.trim();
    if (!text) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/tasks/${selectedTaskId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTaskId ? { ...t, messages: data.data } : t))
        );
        setReplyText("");
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (err) {
      alert("Error sending message");
    } finally {
      setIsSending(false);
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

  // Filter tasks based on search and tab
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterTab === "ACTIVE") {
      return matchesSearch && (task.status === "PENDING" || task.status === "IN_PROGRESS");
    }
    if (filterTab === "COMPLETED") {
      return matchesSearch && task.status === "COMPLETED";
    }
    return matchesSearch;
  });

  const selectedTask = tasks.find((t) => t._id === selectedTaskId) || null;
  const activeCount = tasks.filter((t) => t.status !== "COMPLETED").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure parent main container is full-size without padding or max-w restrictions
    const el = containerRef.current;
    if (el) {
      let curr = el.parentElement;
      while (curr && curr.tagName !== "MAIN") {
        curr.classList.remove("max-w-7xl", "mx-auto");
        curr = curr.parentElement;
      }
      if (curr && curr.tagName === "MAIN") {
        curr.classList.remove("p-4", "p-6");
        curr.classList.add("overflow-hidden");
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-white flex flex-col md:flex-row font-sans overflow-hidden"
    >
      {/* 🟢 LEFT PANEL: WhatsApp Chat List */}
      <div
        className={`w-full md:w-80 lg:w-[400px] flex flex-col bg-white border-r border-slate-200 shrink-0 h-full ${
          selectedTaskId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* WhatsApp Top Profile & Header Bar */}
        <div className="bg-[#f0f2f5] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#008069] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-sm leading-tight">Tasks & Chats</h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {activeCount} pending • {completedCount} done
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-[#25d366]/15 text-[#008069] px-2 py-0.5 rounded-full border border-[#25d366]/30">
            I AM THE BOSS
          </span>
        </div>

        {/* WhatsApp Search Bar */}
        <div className="p-2.5 bg-white border-b border-slate-100">
          <div className="relative flex items-center bg-[#f0f2f5] rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#00a884] focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search or start new task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-3 py-2 bg-white flex items-center gap-1.5 border-b border-slate-100 overflow-x-auto text-[11px]">
          <button
            onClick={() => setFilterTab("ALL")}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              filterTab === "ALL"
                ? "bg-[#008069] text-white shadow-xs"
                : "bg-[#f0f2f5] text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterTab("ACTIVE")}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              filterTab === "ACTIVE"
                ? "bg-[#008069] text-white shadow-xs"
                : "bg-[#f0f2f5] text-slate-600 hover:bg-slate-200"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterTab("COMPLETED")}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              filterTab === "COMPLETED"
                ? "bg-[#008069] text-white shadow-xs"
                : "bg-[#f0f2f5] text-slate-600 hover:bg-slate-200"
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        {/* WhatsApp Chat Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-[#008069] mb-2" />
              <p className="text-xs font-medium">Loading conversations...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-xs font-bold">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTaskId === task._id;
              const lastMsg = task.messages && task.messages.length > 0 
                ? task.messages[task.messages.length - 1] 
                : null;

              return (
                <div
                  key={task._id}
                  onClick={() => setSelectedTaskId(task._id)}
                  className={`px-3.5 py-3 cursor-pointer transition-colors flex items-center gap-3 relative ${
                    isSelected ? "bg-[#f0f2f5] border-l-4 border-[#00a884]" : "hover:bg-slate-50"
                  }`}
                >
                  {/* Avatar Icon */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs ${
                    task.status === "COMPLETED"
                      ? "bg-emerald-600"
                      : task.status === "IN_PROGRESS"
                      ? "bg-amber-500"
                      : "bg-indigo-600"
                  }`}>
                    {task.title.charAt(0).toUpperCase()}
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h3 className="font-bold text-xs text-slate-800 truncate">
                        {task.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {new Date(task.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      {lastMsg ? (
                        <>
                          <span className="font-semibold text-slate-700">{lastMsg.senderName}:</span>
                          <span>{lastMsg.text}</span>
                        </>
                      ) : (
                        <span>{task.description}</span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      {/* Status badge */}
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : task.status === "IN_PROGRESS"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {task.status.replace("_", " ")}
                      </span>

                      {/* Message Count Badge */}
                      {task.messages && task.messages.length > 0 && (
                        <span className="bg-[#25d366] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
                          {task.messages.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🟢 RIGHT PANEL: WhatsApp Chat Window */}
      <div
        className={`flex-1 flex flex-col h-full bg-[#efeae2] relative ${
          !selectedTaskId ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedTask ? (
          <>
            {/* WhatsApp Top Header Bar */}
            <div className="bg-[#f0f2f5] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <button
                  onClick={() => setSelectedTaskId(null)}
                  className="md:hidden p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>

                <div className="w-10 h-10 rounded-full bg-[#008069] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {selectedTask.title.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-bold text-xs md:text-sm text-slate-800 leading-tight">
                    {selectedTask.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                    <span>From: <strong className="text-slate-700">{selectedTask.assignedBy?.name}</strong></span>
                    <span>•</span>
                    <span className="text-[#008069] flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] inline-block animate-pulse" />
                      Active Task
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedTask.status === "PENDING" && (
                  <button
                    onClick={() => updateTaskStatus(selectedTask._id, "IN_PROGRESS")}
                    disabled={updatingTaskId === selectedTask._id}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                  >
                    {updatingTaskId === selectedTask._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Clock size={13} />
                        <span>Start Task</span>
                      </>
                    )}
                  </button>
                )}
                {selectedTask.status !== "COMPLETED" ? (
                  <button
                    onClick={() => updateTaskStatus(selectedTask._id, "COMPLETED")}
                    disabled={updatingTaskId === selectedTask._id}
                    className="px-3 py-1.5 bg-[#008069] hover:bg-[#006a57] text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                  >
                    {updatingTaskId === selectedTask._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Complete</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Done
                  </span>
                )}
              </div>
            </div>

            {/* WhatsApp Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2] scrollbar-thin">
              {/* WhatsApp Pinned Notice: Task Instructions */}
              <div className="flex justify-center my-1">
                <div className="bg-[#fff9c4] border border-[#fbc02d]/40 text-[#4a3e00] text-xs px-4 py-2.5 rounded-2xl shadow-xs max-w-lg text-center">
                  <div className="font-bold flex items-center justify-center gap-1.5 text-[#795548] mb-1">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Task Instructions from Super Admin</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
                    {selectedTask.description}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-[#fbc02d]/30 text-[10px] text-[#6d4c41] flex items-center justify-center gap-3">
                    <span>Priority: <strong>{selectedTask.priority}</strong></span>
                    <span>•</span>
                    <span>Date: {new Date(selectedTask.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              {selectedTask.messages && selectedTask.messages.length > 0 ? (
                selectedTask.messages.map((msg, idx) => {
                  const isMe = msg.senderRole !== "ADMIN";
                  return (
                    <div
                      key={msg._id || idx}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"} my-1`}
                    >
                      <div
                        className={`relative px-3.5 py-2 max-w-[85%] sm:max-w-[75%] shadow-xs text-xs ${
                          isMe
                            ? "bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-xs border border-[#b8f5b0]"
                            : "bg-white text-[#111b21] rounded-2xl rounded-tl-xs border border-[#e3ded6]"
                        }`}
                      >
                        {/* Sender Label */}
                        {!isMe && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-[11px] text-[#008069]">
                              {msg.senderName}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              ({msg.senderRole})
                            </span>
                          </div>
                        )}

                        {/* Text */}
                        <p className="whitespace-pre-wrap text-[12px] leading-relaxed pr-8 text-[#111b21]">
                          {msg.text}
                        </p>

                        {/* Time & Double Ticks */}
                        <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-slate-400 font-medium">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMe && (
                            <span className="text-[#53bdeb] font-bold text-[11px] tracking-tighter" title="Delivered">
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <span className="bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs text-slate-500 font-medium shadow-2xs border border-slate-200">
                    No replies yet. Type a message below to send an update!
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* WhatsApp Bottom Input Bar */}
            <div className="p-3 bg-[#f0f2f5] border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendReply();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message / revert..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-white border-0 rounded-full px-4 py-2.5 text-xs text-[#111b21] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00a884] shadow-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={isSending || !replyText.trim()}
                  className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008069] text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-xs shrink-0"
                  title="Send message"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 ml-0.5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty state when no task selected */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f0f2f5]">
            <div className="w-16 h-16 rounded-full bg-[#008069]/10 text-[#008069] flex items-center justify-center mb-3">
              <ClipboardList size={32} />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">WhatsApp Task Workspace</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Select a task from the left panel to read instructions, update status, and send instant chat reverts to the Super Admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
