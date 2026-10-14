import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRoute, Link } from "wouter";
import type { BookingWithDetails } from "@shared/schema";
import {
  ClipboardList, Clock, CheckCircle, Truck, Loader2, Star,
  ChevronLeft, MapPin, Car as CarIcon, Sparkles, Calendar
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

const statusSteps = ["new", "confirmed", "on_the_way", "in_progress", "completed"];

export default function OrdersPage() {
  const [match, params] = useRoute("/customer/orders/:id");

  if (match && params?.id) {
    return <OrderDetail id={params.id} />;
  }
  return <OrdersList />;
}

function OrdersList() {
  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({
    queryKey: ["/api/bookings"],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 pb-10">
          <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">طلباتي</h1>
          <p className="text-white/70 text-sm">سجل جميع طلباتك</p>
        </div>
      </div>

      <div className="relative px-4 -mt-4 pb-28">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
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
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {booking.scheduledDate}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {booking.scheduledTime}
                              </span>
                            </div>
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
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <ClipboardList className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">لا توجد طلبات</h3>
                <p className="text-muted-foreground text-sm mb-4">لم تقم بأي حجز بعد</p>
                <Link href="/customer/book">
                  <Button data-testid="button-book-now">احجز الآن</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function OrderDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const [ratingOpen, setRatingOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const { data: booking, isLoading } = useQuery<BookingWithDetails>({
    queryKey: ["/api/bookings", id],
  });

  const rateMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/bookings/${id}/rate`, { stars, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings", id] });
      setRatingOpen(false);
      toast({ title: "شكراً لتقييمك!" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pt-20">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!booking) return null;

  const currentStepIndex = statusSteps.indexOf(booking.status);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 pb-10">
          <Link href="/customer/orders">
            <Button variant="ghost" size="sm" className="text-white mb-2" data-testid="button-back-orders">
              رجوع للطلبات
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">تفاصيل الطلب</h1>
        </div>
      </div>

      <div className="relative px-4 -mt-4 pb-28 max-w-lg mx-auto space-y-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold mb-4">حالة الطلب</h3>
              <div className="flex items-center gap-1 mb-2">
                {statusSteps.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1 transition-colors ${
                        i <= currentStepIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </motion.div>
                    <span className="text-[10px] text-muted-foreground text-center">
                      {statusMap[s]?.label}
                    </span>
                  </div>
                ))}
              </div>
              <Badge variant="secondary" className={`mt-2 ${statusMap[booking.status]?.color}`}>
                {statusMap[booking.status]?.label}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-5 space-y-3">
              <DetailRow icon={<CarIcon className="w-4 h-4" />} label="السيارة" value={`${booking.car?.brand} ${booking.car?.model}`} />
              <DetailRow icon={<Calendar className="w-4 h-4" />} label="التاريخ" value={booking.scheduledDate} />
              <DetailRow icon={<Clock className="w-4 h-4" />} label="الوقت" value={booking.scheduledTime} />
              <DetailRow icon={<MapPin className="w-4 h-4" />} label="العنوان" value={booking.address || "-"} />
            </CardContent>
          </Card>
        </motion.div>

        {booking.services && booking.services.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-bold">الخدمات</h3>
                </div>
                <div className="space-y-2">
                  {booking.services.map((bs) => (
                    <div key={bs.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm">{bs.service?.name}</span>
                      <span className="text-sm font-medium">{Number(bs.price)} ريال</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between gap-2">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-primary" data-testid="text-order-total">{Number(booking.totalPrice)} ريال</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {booking.status === "completed" && !booking.rating && (
          <>
            <Button onClick={() => setRatingOpen(true)} className="w-full rounded-[0.75rem]" data-testid="button-rate">
              <Star className="w-4 h-4 ml-2" />
              قيّم الخدمة
            </Button>
            <Dialog open={ratingOpen} onOpenChange={setRatingOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>تقييم الخدمة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-center gap-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setStars(s)} data-testid={`button-star-${s}`}>
                        <Star
                          className={`w-8 h-8 transition-colors ${s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتب ملاحظاتك..."
                    data-testid="input-rating-comment"
                  />
                  <Button
                    onClick={() => rateMutation.mutate()}
                    disabled={rateMutation.isPending}
                    className="w-full rounded-[0.75rem]"
                    data-testid="button-submit-rating"
                  >
                    {rateMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {booking.rating && (
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold mb-2">تقييمك</h3>
              <div className="flex gap-1 mb-2" dir="ltr">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${s <= booking.rating!.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              {booking.rating.comment && (
                <p className="text-sm text-muted-foreground">{booking.rating.comment}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon} {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  const c = "w-5 h-5";
  switch (status) {
    case "new": return <Clock className={`${c} text-blue-500`} />;
    case "confirmed": return <CheckCircle className={`${c} text-yellow-500`} />;
    case "on_the_way": return <Truck className={`${c} text-orange-500`} />;
    case "in_progress": return <Loader2 className={`${c} text-purple-500 animate-spin`} />;
    case "completed": return <CheckCircle className={`${c} text-green-500`} />;
    default: return <Clock className={`${c} text-muted-foreground`} />;
  }
}
