import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/celebrity/:slug" component={CelebrityProfile} />
      <Route path="/celebrity/:slug/get-fancard" component={FanCardPurchase} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/manager" component={Manager} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full bg-background overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 shrink-0 z-50">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex-1" />
              </header>
              <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
