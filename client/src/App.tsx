import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CelebrityProfile from "@/pages/CelebrityProfile";
import FanCardPurchase from "@/pages/FanCardPurchase";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Manager from "@/pages/Manager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/celebrity/:slug" component={CelebrityProfile} />
      <Route path="/celebrity/:slug/get-fancard" component={FanCardPurchase} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/manager" component={Manager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
