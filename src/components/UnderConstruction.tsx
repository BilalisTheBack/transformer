import { Construction, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-app-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative bg-app-panel border border-app-border p-8 rounded-[40px] shadow-2xl">
          <Construction className="w-24 h-24 text-app-primary animate-bounce" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-4xl font-black gradient-text-optimized">
          Coming Soon
        </h1>
        <p className="text-app-text-sub text-lg leading-relaxed">
          We're hard at work building this pro-grade tool. It'll be ready in the
          next update!
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-8 py-4 bg-app-panel border border-app-border rounded-2xl font-bold hover:bg-app-primary hover:text-white hover:border-app-primary transition-all active:scale-95 shadow-xl"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
    </div>
  );
}
