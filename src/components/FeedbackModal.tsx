import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Mail, Github, MessageSquare, Bug, Lightbulb } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = "bug" | "feature" | "other";

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<FeedbackType>("bug");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSendEmail = () => {
    const email = "bilalisback@gmail.com"; // Replace with actual support email if needed
    const emailSubject = `[${type.toUpperCase()}] ${subject}`;
    const body = `${description}\n\n---\nVersion: 1.2.0\nUA: ${navigator.userAgent}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  const handleOpenGithub = () => {
    const baseUrl = "https://github.com/BilalisTheBack/transformer/issues/new";
    const labels =
      type === "bug" ? "bug" : type === "feature" ? "enhancement" : "question";
    const body = `${description}\n\n---\nVersion: 1.2.0\nUA: ${navigator.userAgent}`;
    window.open(
      `${baseUrl}?title=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}&labels=${labels}`,
      "_blank"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-app-panel border border-app-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-app-border bg-app-bg/50">
          <h2 className="text-lg font-semibold text-app-text flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-app-primary" />
            {t("feedback.title", "Feedback & Bug Report")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-app-text-sub hover:text-app-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setType("bug")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                type === "bug"
                  ? "bg-red-500/10 border-red-500/50 text-red-500"
                  : "bg-app-bg border-app-border text-app-text-sub hover:border-app-text-sub"
              }`}
            >
              <Bug className="w-6 h-6" />
              <span className="text-xs font-medium">Bug</span>
            </button>
            <button
              onClick={() => setType("feature")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                type === "feature"
                  ? "bg-purple-500/10 border-purple-500/50 text-purple-500"
                  : "bg-app-bg border-app-border text-app-text-sub hover:border-app-text-sub"
              }`}
            >
              <Lightbulb className="w-6 h-6" />
              <span className="text-xs font-medium">Feature</span>
            </button>
            <button
              onClick={() => setType("other")}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                type === "other"
                  ? "bg-blue-500/10 border-blue-500/50 text-blue-500"
                  : "bg-app-bg border-app-border text-app-text-sub hover:border-app-text-sub"
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs font-medium">Other</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-app-text-sub mb-1 block">
                {t("feedback.subject", "Subject")}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary..."
                className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-app-text placeholder:text-app-text-mute focus:outline-none focus:border-app-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-app-text-sub mb-1 block">
                {t("feedback.description", "Description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the issue or idea..."
                className="w-full h-32 bg-app-bg border border-app-border rounded-lg px-3 py-2 text-app-text placeholder:text-app-text-mute focus:outline-none focus:border-app-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSendEmail}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-app-bg border border-app-border hover:bg-app-panel text-app-text rounded-lg transition-colors font-medium"
            >
              <Mail className="w-4 h-4" />
              {t("feedback.send_email", "Send Email")}
            </button>
            <button
              onClick={handleOpenGithub}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-app-primary hover:bg-app-primary-hover text-white rounded-lg transition-colors font-medium shadow-lg shadow-app-primary/20"
            >
              <Github className="w-4 h-4" />
              {t("feedback.open_github", "Open GitHub")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
