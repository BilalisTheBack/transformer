import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface DragDropContextType {
  isDragging: boolean;
  droppedFile: File | null;
  clearDroppedFile: () => void;
  resetDragState: () => void;
}

const DragDropContext = createContext<DragDropContextType>({
  isDragging: false,
  droppedFile: null,
  clearDroppedFile: () => {},
  resetDragState: () => {},
});

export function useDragDrop() {
  return useContext(DragDropContext);
}

export function DragDropProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const dragCounter = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  const clearDroppedFile = useCallback(() => {
    setDroppedFile(null);
  }, []);

  const resetDragState = useCallback(() => {
    dragCounter.current = 0;
    setIsDragging(false);
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.types && e.dataTransfer.types.includes("Files")) {
      dragCounter.current += 1;
      if (dragCounter.current > 0) {
        setIsDragging(true);
      }
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.types && e.dataTransfer.types.includes("Files")) {
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounter.current = 0;
      setIsDragging(false);

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const fileName = file.name ? file.name.toLowerCase() : "";

        // Store the file in context so components can consume it
        setDroppedFile(file);

        let targetPath = "/metadata"; // Default

        if (fileName.endsWith(".json")) {
          targetPath = "/json-csv";
        } else if (fileName.endsWith(".pdf")) {
          targetPath = "/metadata";
        } else if (/\.(jpg|jpeg|png|gif|bmp|webp|avif)$/i.test(fileName)) {
          targetPath = "/image-converter";
        } else if (fileName.endsWith(".svg")) {
          targetPath = "/svg";
        } else if (fileName.endsWith(".md")) {
          targetPath = "/markdown";
        } else if (fileName.endsWith(".sql")) {
          targetPath = "/sql";
        } else if (fileName.endsWith(".txt") || fileName.endsWith(".log")) {
          targetPath = "/log-analyzer";
        } else if (/\.(mp4|avi|mov|mkv|webm)$/i.test(fileName)) {
          targetPath = "/metadata";
        } else if (/\.(mp3|wav|ogg|flac|m4a)$/i.test(fileName)) {
          targetPath = "/metadata";
        }

        // Special logic: If we are in metadata viewer, we likely want to inspect ANY file,
        // even if it's an image that would normally go to image converter.
        // Exception: If the user specifically dropped a JSON file while in metadata viewer,
        // maybe they still want metadata? Let's assume Metadata Viewer is the "Universal File Viewer".
        // SO: If we are already at /metadata, STAY THERE.

        if (location.pathname === "/metadata") {
          // Do not navigate away from metadata viewer, regardless of file type.
          // The MetadataViewer component will pick up 'droppedFile' from context.
          return;
        }

        // Otherwise, navigate if the target path is different
        if (location.pathname !== targetPath) {
          navigate(targetPath);
        }
      }
    },
    [navigate, location.pathname]
  );

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <DragDropContext.Provider
      value={{ isDragging, droppedFile, clearDroppedFile, resetDragState }}
    >
      {children}
      {isDragging && (
        <div className="fixed inset-0 z-[10000] bg-app-bg/80 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-in fade-in duration-200">
          <div className="bg-app-panel border-2 border-dashed border-app-primary rounded-3xl p-12 flex flex-col items-center justify-center shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-app-primary/10 flex items-center justify-center mb-6 text-app-primary animate-bounce">
              <UploadCloud className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-app-text mb-2">
              {t("common.dropFile")}
            </h2>
            <p className="text-app-text-sub text-lg text-center max-w-md">
              {t("common.dropFileDesc")}
            </p>
          </div>
        </div>
      )}
    </DragDropContext.Provider>
  );
}
