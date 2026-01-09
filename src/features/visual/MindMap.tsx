import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Trash2,
  Download,
  Move,
  HelpCircle,
  Grab,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentTools } from "../../hooks/useRecentTools";
import html2canvas from "html2canvas";

interface MindNode {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-indigo-500",
];

const MindMap: React.FC = () => {
  const { t } = useTranslation();
  useRecentTools();

  const [nodes, setNodes] = useState<MindNode[]>([
    { id: "root", text: "Ana Konu", x: 400, y: 300, color: "bg-blue-600" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addNode = () => {
    const newNode: MindNode = {
      id: Math.random().toString(36).substr(2, 9),
      text: "Yeni Düğüm",
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodeText = (id: string, text: string) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, text } : node)));
  };

  const deleteNode = (id: string) => {
    if (id === "root") return;
    setNodes(nodes.filter((node) => node.id !== id));
  };

  const exportAsImage = async () => {
    if (containerRef.current) {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "mind-map.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-app-panel p-6 rounded-2xl border border-app-border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-app-text flex items-center gap-2">
            <Grab className="w-6 h-6 text-app-primary" />
            {t("mindflow.title")}
          </h1>
          <p className="text-sm text-app-text-sub max-w-2xl">
            {t("mindflow.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addNode}
            className="flex items-center gap-2 px-4 py-2 bg-app-primary text-white rounded-xl hover:bg-app-primary-hover transition-all shadow-lg shadow-app-primary/20"
          >
            <Plus className="w-4 h-4" />
            {t("mindflow.addNode")}
          </button>
          <button
            onClick={exportAsImage}
            className="p-2 bg-app-panel border border-app-border text-app-text-sub rounded-xl hover:text-app-primary hover:border-app-primary/50 transition-all"
            title={t("mindflow.export")}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setNodes([
                {
                  id: "root",
                  text: "Ana Konu",
                  x: 400,
                  y: 300,
                  color: "bg-blue-600",
                },
              ])
            }
            className="p-2 bg-app-panel border border-app-border text-app-text-sub rounded-xl hover:text-red-500 hover:border-red-500/50 transition-all"
            title={t("mindflow.clear")}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div
        ref={containerRef}
        className="relative w-full h-[600px] bg-app-panel rounded-2xl border border-app-border overflow-hidden cursor-crosshair shadow-inner"
        style={{
          backgroundImage:
            "radial-gradient(var(--app-border) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      >
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes
            .filter((n) => n.id !== "root")
            .map((node) => (
              <line
                key={`line-${node.id}`}
                x1={nodes.find((n) => n.id === "root")?.x || 0}
                y1={nodes.find((n) => n.id === "root")?.y || 0}
                x2={node.x}
                y2={node.y}
                stroke="currentColor"
                strokeWidth="2"
                className="text-app-border opacity-50"
              />
            ))}
        </svg>

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              drag
              dragMomentum={false}
              onDrag={(_, info) => {
                setNodes(
                  nodes.map((n) =>
                    n.id === node.id
                      ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y }
                      : n
                  )
                );
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: node.x, y: node.y }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute group cursor-grab active:cursor-grabbing p-4 rounded-xl shadow-lg border-2 border-white/20 text-white min-w-[150px] ${node.color}`}
              style={{ left: -75, top: -25 }}
            >
              <div className="flex flex-col gap-2">
                {editingId === node.id ? (
                  <input
                    autoFocus
                    className="bg-black/20 border-none text-white text-sm rounded px-1 focus:ring-0 w-full"
                    value={node.text}
                    onChange={(e) => updateNodeText(node.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-semibold truncate cursor-text"
                      onClick={() => setEditingId(node.id)}
                    >
                      {node.text}
                    </span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => deleteNode(node.id)}
                        className="p-1 hover:bg-black/20 rounded text-white/80 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drag Handle Icon (visible on hover) */}
              <div className="absolute -top-2 -left-2 bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity scale-75">
                <Move className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State Help */}
        {nodes.length === 1 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="text-center space-y-2">
              <Move className="w-12 h-12 mx-auto" />
              <p className="text-xl font-medium">
                Sürükleyip Bırakın ve Bağlayın
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-app-panel p-8 rounded-2xl border border-app-border shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-app-primary" />
            {t("mindflow.helpTitle")}
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-app-text">
                {t("mindflow.q1")}
              </h3>
              <p className="text-sm text-app-text-sub leading-relaxed">
                {t("mindflow.a1")}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-app-text">
                {t("mindflow.q2")}
              </h3>
              <p className="text-sm text-app-text-sub leading-relaxed">
                {t("mindflow.a2")}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {t("mindflow.features")}
          </h2>
          <ul className="space-y-3">
            {[
              t("mindflow.feature1"),
              t("mindflow.feature2"),
              t("mindflow.feature3"),
            ].map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-sm text-app-text-sub"
              >
                <div className="w-1.5 h-1.5 bg-app-primary rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MindMap;
