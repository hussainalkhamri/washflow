import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { BookingWithDetails, Car } from "@shared/schema";
import {
  Droplets, Car as CarIcon, CalendarPlus, ClipboardList,
  Clock, CheckCircle, Truck, Loader2, ChevronLeft
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

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }
};

export default function CustomerHome() {
  const { user } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings"],
  });
  const { data: cars } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const activeBookings = bookings?.filter(
    (b) => !["completed", "cancelled"].includes(b.status)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 pb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-2 flex-wrap"
          >
            <div>
              <p className="text-white/70 text-sm">مرحباً</p>
              <h1 className="text-2xl font-bold text-white" data-testid="text-user-name">{user?.name || "عميل"}</h1>
            </div>
            <div className="w-11 h-11 rounded-[0.75rem] bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <img src="/images/logo.svg" alt="WashFlow" className="w-8 h-8 brightness-0 invert" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative px-4 -mt-8 pb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <motion.div variants={fadeUp}>
            <QuickAction href="/customer/book" icon={<CalendarPlus className="w-5 h-5" />} label="حجز جديد" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <QuickAction href="/customer/cars" icon={<CarIcon className="w-5 h-5" />} label="سياراتي" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <QuickAction href="/customer/orders" icon={<ClipboardList className="w-5 h-5" />} label="طلباتي" />
          </motion.div>
        </motion.div>

        {activeBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-lg font-bold mb-3">الطلبات النشطة</h2>
            <div className="space-y-3">
              {activeBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08 }}
                >
                  <Link href={`/customer/orders/${booking.id}`}>
                    <Card className="hover-elevate cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3">
                            <StatusIcon status={booking.status} />
                            <div>
                              <p className="font-semibold text-sm">
                                {booking.car?.brand} {booking.car?.model}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.scheduledDate} - {booking.scheduledTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={statusMap[booking.status]?.color}>
                              {statusMap[booking.status]?.label || booking.status}
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
          </motion.div>
        )}

        {bookingsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        ) : activeBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <img src="/images/logo.svg" alt="WashFlow" className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">مرحباً بك في WashFlow</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  احجز خدمة غسيل سيارتك الآن ونأتي لموقعك
                </p>
                <Link href="/customer/book">
                  <Button data-testid="button-first-booking">احجز الآن</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}

        {cars && cars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <h2 className="text-lg font-bold">سياراتي</h2>
              <Link href="/customer/cars">
                <Button variant="ghost" size="sm" data-testid="link-all-cars">عرض الكل</Button>
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {cars.slice(0, 3).map((car) => (
                <Card key={car.id} className="min-w-[200px] shrink-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[0.75rem] bg-primary/10 flex items-center justify-center">
                        <CarIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{car.brand} {car.model}</p>
                        <p className="text-xs text-muted-foreground">{car.plateNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Card className="hover-elevate cursor-pointer">
        <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
          <div className="w-11 h-11 rounded-[0.75rem] bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
          <span className="text-xs font-semibold">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatusIcon({ status }: { status: string }) {
  const iconClass = "w-5 h-5";
  switch (status) {
    case "new": return <Clock className={`${iconClass} text-blue-500`} />;
    case "confirmed": return <CheckCircle className={`${iconClass} text-yellow-500`} />;
    case "on_the_way": return <Truck className={`${iconClass} text-orange-500`} />;
    case "in_progress": return <Loader2 className={`${iconClass} text-purple-500 animate-spin`} />;
    case "completed": return <CheckCircle className={`${iconClass} text-green-500`} />;
    default: return <Clock className={`${iconClass} text-muted-foreground`} />;
  }
}
