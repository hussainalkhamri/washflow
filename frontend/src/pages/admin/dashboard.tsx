import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { BookingWithDetails } from "@shared/schema";
import {
  ClipboardList, Users, DollarSign, TrendingUp,
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "جديد", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  confirmed: { label: "مؤكد", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
  on_the_way: { label: "في الطريق", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  in_progress: { label: "جاري الغسيل", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
};

interface DashboardStats {
  todayBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  activeBookings: number;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: recentBookings, isLoading: bookingsLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const activeBookings = recentBookings?.filter(
    (b) => !["completed", "cancelled"].includes(b.status)
  ) || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm">نظرة عامة على النشاط</p>
      </motion.div>

      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-md" />)}
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={fadeUp}>
            <StatCard
              icon={<ClipboardList className="w-5 h-5" />}
              label="طلبات اليوم"
              value={stats?.todayBookings || 0}
              gradient="from-blue-500 to-blue-600"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              icon={<DollarSign className="w-5 h-5" />}
              label="الإيرادات"
              value={`${stats?.totalRevenue || 0} ر.س`}
              gradient="from-green-500 to-emerald-600"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="العملاء"
              value={stats?.totalCustomers || 0}
              gradient="from-purple-500 to-purple-600"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="نشط الآن"
              value={stats?.activeBookings || 0}
              gradient="from-orange-500 to-orange-600"
            />
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <h2 className="text-lg font-bold">الطلبات النشطة</h2>
          <Link href="/admin/orders">
            <span className="text-sm text-primary cursor-pointer" data-testid="link-all-orders">
              عرض الكل
            </span>
          </Link>
        </div>

        {bookingsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-md" />)}
          </div>
        ) : activeBookings.length > 0 ? (
          <div className="space-y-3">
            {activeBookings.slice(0, 5).map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
              >
                <Link href={`/admin/orders/${booking.id}`}>
                  <Card className="hover-elevate cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-sm">{booking.user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.car?.brand} {booking.car?.model} - {booking.scheduledDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={statusMap[booking.status]?.color}>
                            {statusMap[booking.status]?.label}
                          </Badge>
                          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground text-sm">لا توجد طلبات نشطة</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode; label: string; value: number | string; gradient: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`w-10 h-10 rounded-[0.75rem] bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 text-white shadow-sm`}>
          {icon}
        </div>
        <p className="text-2xl font-bold" data-testid={`stat-${label}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
