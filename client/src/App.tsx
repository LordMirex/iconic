import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CelebrityProfile from "@/pages/CelebrityProfile";
import FanCardPurchase from "@/pages/FanCardPurchase";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Manager from "@/pages/Manager";
import Settings from "@/pages/Settings";

// Public routes that don't need sidebar
const publicRoutes = ["/", "/login"];

// Check if route starts with these patterns (for dynamic routes)
function isPublicRoute(path: string): boolean {
  return publicRoutes.includes(path) || 
         path.startsWith("/celebrity/");
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/celebrity/:slug" component={CelebrityProfile} />
      <Route path="/celebrity/:slug/get-fancard" component={FanCardPurchase} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function DashboardRouter() {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/manager" component={Manager} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isPublic = isPublicRoute(location);

  if (isPublic) {
    // Public pages without sidebar
    return <PublicRouter />;
  }

  // Dashboard pages with sidebar
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shrink-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
            <DashboardRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
