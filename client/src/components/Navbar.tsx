import { Link, useLocation } from "wouter";
import { Crown, User, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const fanId = localStorage.getItem("fan_id");

  const handleLogout = () => {
    localStorage.removeItem("fan_token");
    localStorage.removeItem("fan_id");
    setLocation("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xl shadow-slate-900/20 transition-all group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-primary">
            <Crown size={22} className="fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-tighter uppercase leading-none">Iconic</span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mt-0.5">Premier Access</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 mr-auto ml-12">
          <Link href="/#explore" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Explore</Link>
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Benefits</a>
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">About</a>
        </div>

        <div className="flex items-center gap-3">
          {fanId ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2 font-bold uppercase tracking-wider text-xs rounded-xl h-11 px-5 border-2 border-transparent hover:border-slate-100 hover:bg-slate-50">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>
              </Link>
              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
              <Button 
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="rounded-xl h-11 w-11 hover:bg-red-50 hover:text-red-500 transition-colors border-2 border-transparent hover:border-red-100"
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="font-bold uppercase tracking-wider text-xs rounded-xl h-11 px-5 hover:bg-slate-50">
                  Log In
                </Button>
              </Link>
              <Link href="/#explore">
                <Button className="gap-2 font-bold uppercase tracking-wider text-xs rounded-xl h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
