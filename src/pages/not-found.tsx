import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
        style={{ backgroundColor: "#080808" }}
      >
        <div className="text-[10px] font-mono tracking-[0.4em] text-primary/60 mb-6">404_NOT_FOUND</div>
        <h1
          className="font-black tracking-tighter mb-4 leading-none"
          style={{
            fontSize: "clamp(80px, 15vw, 180px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(232,60,135,0.2)",
          }}
        >
          404
        </h1>
        <p className="text-white/30 font-mono text-sm mb-8 max-w-sm leading-relaxed">
          This route does not exist in the network. The intent you submitted could not be resolved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 text-xs font-mono font-bold tracking-widest hover:bg-primary/90 transition-all"
          data-testid="link-404-home"
        >
          RETURN TO BASE <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Layout>
  );
}
