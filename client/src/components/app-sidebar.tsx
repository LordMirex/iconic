import {
  Calendar,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  LogOut,
  Star
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Featured Stars",
    url: "/#featured",
    icon: Star,
  },
];

const managerItems = [
  {
    title: "Manager Dashboard",
    url: "/manager",
    icon: LayoutDashboard,
  },
  {
    title: "Celebrities",
    url: "/manager/celebrities",
    icon: Users,
  },
  {
    title: "Events",
    url: "/manager/events",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <Star className="fill-primary" />
          <span>CelebConnect</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    onClick={() => setLocation(item.url)}
                  >
                    <button className="w-full text-left">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    onClick={() => setLocation(item.url)}
                  >
                    <button className="w-full text-left">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button 
                className="w-full text-left flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setLocation("/login")}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
