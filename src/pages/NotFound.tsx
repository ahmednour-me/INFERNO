import { Link } from "react-router-dom";
import { InfernoLogo } from "@/components/InfernoLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col items-center justify-center gap-6">
      <InfernoLogo size={64} />
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-mono font-bold text-primary">404</h1>
        <p className="font-mono text-muted-foreground">Page not found</p>
      </div>
      <Link to="/" className="px-4 py-2 rounded-md border border-primary text-primary font-mono text-sm hover:bg-primary/10 transition">
        ← Back to Forge
      </Link>
    </div>
  );
}
