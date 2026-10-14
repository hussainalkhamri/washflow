import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, DollarSign, ClipboardList, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ReportData {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
  revenueByService: { name: string; revenue: number; count: number }[];
  monthlyRevenue: { month: string; revenue: number; count: number }[];
}

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminReportsPage() {
  const { data: report, isLoading } = useQuery<ReportData>({ queryKey: ["/api/admin/reports"] });
  if (isLoading) return (<div className="space-y-6"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-28 rounded-md" />)}</div><Skeleton className="h-64 rounded-md" /></div>);
  if (!report) return null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" data-testid="text-admin-reports-title">التقارير</h1>
        <p className="text-muted-foreground text-sm">إحصائيات وتقارير شاملة</p>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp}><StatCard icon={<DollarSign className="w-5 h-5" />} label="إجمالي الإيرادات" value={`${report.totalRevenue} ر.س`} gradient="from-green-500 to-emerald-600" /></motion.div>
        <motion.div variants={fadeUp}><StatCard icon={<ClipboardList className="w-5 h-5" />} label="إجمالي الطلبات" value={report.totalBookings} gradient="from-blue-500 to-blue-600" /></motion.div>
        <motion.div variants={fadeUp}><StatCard icon={<TrendingUp className="w-5 h-5" />} label="مكتملة" value={report.completedBookings} gradient="from-purple-500 to-purple-600" /></motion.div>
        <motion.div variants={fadeUp}><StatCard icon={<Star className="w-5 h-5" />} label="متوسط التقييم" value={report.averageRating.toFixed(1)} gradient="from-yellow-500 to-amber-600" /></motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card><CardContent className="p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5" /> إيرادات الخدمات</h3>
          {report.revenueByService.length > 0 ? (
            <div className="space-y-3">
              {report.revenueByService.map((item, i) => {
                const maxRevenue = Math.max(...report.revenueByService.map((x) => x.revenue));
                const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
                    <div className="flex items-center justify-between gap-2 mb-1"><span className="text-sm font-medium">{item.name}</span><span className="text-sm text-muted-foreground">{item.revenue} ر.س ({item.count} طلب)</span></div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden"><motion.div className="bg-primary rounded-full h-2" initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }} /></div>
                  </motion.div>
                );
              })}
            </div>
          ) : (<p className="text-muted-foreground text-sm text-center">لا توجد بيانات</p>)}
        </CardContent></Card>
      </motion.div>
      {report.monthlyRevenue.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card><CardContent className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> الإيرادات الشهرية</h3>
            <div className="space-y-3">
              {report.monthlyRevenue.map((item, i) => {
                const maxRev = Math.max(...report.monthlyRevenue.map((x) => x.revenue));
                const pct = maxRev > 0 ? (item.revenue / maxRev) * 100 : 0;
                return (
                  <motion.div key={item.month} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.05 }}>
                    <div className="flex items-center justify-between gap-2 mb-1"><span className="text-sm font-medium">{item.month}</span><span className="text-sm text-muted-foreground">{item.revenue} ر.س</span></div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden"><motion.div className="bg-chart-2 rounded-full h-2" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.6 + i * 0.05, duration: 0.6 }} /></div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent></Card>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode; label: string; value: number | string; gradient: string }) {
  return (
    <Card><CardContent className="p-4">
      <div className={`w-10 h-10 rounded-[0.75rem] bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 text-white shadow-sm`}>{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent></Card>
  );
}
