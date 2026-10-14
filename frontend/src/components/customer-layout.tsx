import { useLocation, Link } from "wouter";
import { Home, Car, CalendarPlus, ClipboardList, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/customer", icon: Home, label: "الرئيسية" },
  { href: "/customer/cars", icon: Car, label: "سياراتي" },
  { href: "/customer/book", icon: CalendarPlus, label: "حجز" },
  { href: "/customer/orders", icon: ClipboardList, label: "طلباتي" },
  { href: "/customer/profile", icon: User, label: "حسابي" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {children}
      <nav className="fixed bottom-0 right-0 left-0 z-50 px-4 pb-2 pt-0">
        <div className="glass-strong rounded-[1.25rem] border border-white/20 dark:border-white/10 shadow-lg max-w-lg mx-auto">
          <div className="flex items-center justify-around py-2 px-1">
            {navItems.map((item) => {
              const isActive = location === item.href || 
                (item.href === "/customer" && location === "/") ||
                (item.href !== "/customer" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] transition-all duration-300"
                    data-testid={`nav-${item.label}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-[0.75rem]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className={`text-[10px] font-medium relative z-10 transition-colors duration-300 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
