import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Phone, LogOut, Shield, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 pb-16">
          <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">حسابي</h1>
        </div>
      </div>

      <div className="relative px-4 -mt-10 pb-28 max-w-lg mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-xl font-bold">
                    {user?.name?.charAt(0) || "م"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold" data-testid="text-profile-name">{user?.name}</h2>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {user?.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover-elevate cursor-pointer" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[0.75rem] bg-accent flex items-center justify-center">
                  {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">المظهر</p>
                  <p className="text-xs text-muted-foreground">{theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/admin">
              <Card className="hover-elevate cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[0.75rem] bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">لوحة تحكم الإدارة</p>
                      <p className="text-xs text-muted-foreground">إدارة الطلبات والخدمات</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full text-destructive"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
