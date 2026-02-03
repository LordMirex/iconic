import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md mx-4">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
          <AlertTriangle size={40} />
        </div>
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-slate-600 mb-8 text-lg">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
