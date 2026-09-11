"use client";

import React, { useRef, useEffect } from "react";
import { Send, Loader2, X, User } from "lucide-react";

export interface Message {
  _id?: string;
  sender: string;
  senderRole: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface ChatTask {
  _id: string;
  title: string;
  description: string;
  assignedBy?: {
    _id?: string;
    name: string;
    role?: string;
  };
  assignee?: {
    _id?: string;
    name: string;
    role?: string;
  };
  messages?: Message[];
  createdAt: string;
}

interface TaskChatDrawerProps {
  task: ChatTask;
  currentUserRole: string; // 'ADMIN', 'STAFF', 'COUNSELOR', 'ACADEMIC'
  replyText: string;
  isSending: boolean;
  onClose: () => void;
  onReplyTextChange: (text: string) => void;
  onSendMessage: () => void;
}

export default function TaskChatDrawer({
  task,
  currentUserRole,
  replyText,
  isSending,
  onClose,
  onReplyTextChange,
  onSendMessage,
}: TaskChatDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [task.messages]);

  // Determine chat partner info
  const isSuperAdmin = currentUserRole === "ADMIN";
  const partnerName = isSuperAdmin
    ? task.assignee?.name || "Team Member"
    : task.assignedBy?.name || "Super Admin";
  const partnerRole = isSuperAdmin
    ? task.assignee?.role || "MEMBER"
    : "SUPER ADMIN";

  return (
    <div className="mt-3 rounded-2xl overflow-hidden border border-[#d1c7b7] shadow-md bg-[#efeae2] flex flex-col font-sans transition-all">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#008069] text-white px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
            <User size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs text-white leading-tight">{partnerName}</h4>
              <span className="text-[9px] bg-white/20 text-white font-semibold px-1.5 py-0.2 rounded">
                {partnerRole}
              </span>
            </div>
            <span className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] inline-block animate-pulse" />
              Task Chat • {task.title}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Close chat"
        >
          <X size={17} />
        </button>
      </div>

      {/* WhatsApp Message Area with authentic styling */}
      <div className="p-3 space-y-2 max-h-72 overflow-y-auto bg-[#efeae2] scrollbar-thin">
        {/* System Pin: Original Task Instruction */}
        <div className="flex justify-center my-1">
          <div className="bg-[#fff9c4] border border-[#fbc02d]/40 text-[#4a3e00] text-[11px] px-3.5 py-1.5 rounded-xl shadow-2xs max-w-[92%] text-center">
            <span className="font-bold block text-[#795548] mb-0.5">
              📋 Initial Task Instruction ({task.assignedBy?.name || "Admin"}):
            </span>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-800">{task.description}</p>
          </div>
        </div>

        {/* Conversation Bubbles */}
        {task.messages && task.messages.length > 0 ? (
          task.messages.map((msg, idx) => {
            const isMe = isSuperAdmin
              ? msg.senderRole === "ADMIN"
              : msg.senderRole !== "ADMIN";

            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} my-1`}
              >
                <div
                  className={`relative px-3.5 py-2 max-w-[85%] sm:max-w-[78%] shadow-xs text-xs ${
                    isMe
                      ? "bg-[#d9fdd3] text-[#111b21] rounded-2xl rounded-tr-xs border border-[#b8f5b0]"
                      : "bg-white text-[#111b21] rounded-2xl rounded-tl-xs border border-[#e3ded6]"
                  }`}
                >
                  {/* Sender Name for incoming */}
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

                  {/* Message Content */}
                  <p className="whitespace-pre-wrap text-[12px] leading-relaxed pr-8 text-[#111b21]">
                    {msg.text}
                  </p>

                  {/* Timestamp & Double Checkmarks */}
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-slate-400">
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMe && (
                      <span className="text-[#53bdeb] font-bold text-[11px] tracking-tighter" title="Delivered & Read">
                        ✓✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-slate-500 text-xs">
            <span className="bg-white/80 px-3 py-1 rounded-full text-[11px] border border-slate-200">
              No replies yet. Type a message below to reply!
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp Input Bar */}
      <div className="p-2.5 bg-[#f0f2f5] border-t border-[#d8d2c7]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            className="flex-1 bg-white border-0 rounded-full px-4 py-2 text-xs text-[#111b21] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00a884] shadow-xs"
          />
          <button
            type="submit"
            disabled={isSending || !replyText.trim()}
            className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008069] text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-xs shrink-0"
            title="Send"
          >
            {isSending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5 ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
