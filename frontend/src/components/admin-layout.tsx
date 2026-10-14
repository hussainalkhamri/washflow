import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard, ClipboardList, Users, Sparkles,
  BarChart3, Droplets, ArrowRight, LogOut
} from "lucide-react";

const menuItems = [
  { title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard },
  { title: "الطلبات", url: "/admin/orders", icon: ClipboardList },
  { title: "العملاء", url: "/admin/customers", icon: Users },
  { title: "الخدمات", url: "/admin/services", icon: Sparkles },
  { title: "التقارير", url: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar side="right">
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-[0.75rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md">
                  <img src="/images/logo.svg" alt="WashFlow" className="w-6 h-6 brightness-0 invert" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gradient">WashFlow</p>
                  <p className="text-[11px] text-muted-foreground">لوحة الإدارة</p>
                </div>
              </div>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>القائمة</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location === item.url || (item.url !== "/admin" && location.startsWith(item.url));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.url}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/customer">
                        <ArrowRight className="w-4 h-4" />
                        <span>واجهة العميل</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout}>
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 px-4 py-3 border-b glass-strong sticky top-0 z-40">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 gradient-mesh min-h-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
