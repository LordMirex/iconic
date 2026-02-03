import { Link, useLocation } from "wouter";
import { Crown, User, LogOut } from "lucide-react";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const fanId = localStorage.getItem("fan_id");

  const handleLogout = () => {
    localStorage.removeItem("fan_token");
    localStorage.removeItem("fan_id");
    setLocation("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Crown size={18} className="fill-current" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">StarPass</span>
        </Link>

        <div className="flex items-center gap-4">
          {fanId ? (
            <>
              <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-slate-100 text-muted-foreground hover:text-foreground transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 hover:shadow-lg transition-all">
              <User size={16} />
              <span>Fan Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
