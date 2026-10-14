import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRoute, Link } from "wouter";
import type { BookingWithDetails } from "@shared/schema";
import {
  ChevronLeft, MapPin, Car as CarIcon, Sparkles, Calendar,
  User, Star, StickyNote
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
const allStatuses = ["new", "confirmed", "on_the_way", "in_progress", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [match, params] = useRoute("/admin/orders/:id");
  if (match && params?.id) return <AdminOrderDetail id={params.id} />;
  return <AdminOrdersList />;
}

function AdminOrdersList() {
  const [tab, setTab] = useState("active");
  const { data: bookings, isLoading } = useQuery<BookingWithDetails[]>({ queryKey: ["/api/admin/bookings"] });
  const activeBookings = bookings?.filter((b) => !["completed", "cancelled"].includes(b.status)) || [];
  const completedBookings = bookings?.filter((b) => b.status === "completed") || [];
  const cancelledBookings = bookings?.filter((b) => b.status === "cancelled") || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" data-testid="text-admin-orders-title">إدارة الطلبات</h1>
        <p className="text-muted-foreground text-sm">جميع الطلبات وحالاتها</p>
      </motion.div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">نشط ({activeBookings.length})</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">مكتمل ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">ملغي ({cancelledBookings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active"><BookingList bookings={activeBookings} isLoading={isLoading} /></TabsContent>
        <TabsContent value="completed"><BookingList bookings={completedBookings} isLoading={isLoading} /></TabsContent>
        <TabsContent value="cancelled"><BookingList bookings={cancelledBookings} isLoading={isLoading} /></TabsContent>
      </Tabs>
    </div>
  );
}

function BookingList({ bookings, isLoading }: { bookings: BookingWithDetails[]; isLoading: boolean }) {
  if (isLoading) return <div className="space-y-3 mt-4">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 rounded-md" />)}</div>;
  if (bookings.length === 0) return <Card className="mt-4"><CardContent className="p-6 text-center"><p className="text-muted-foreground text-sm">لا توجد طلبات</p></CardContent></Card>;
  return (
    <div className="space-y-3 mt-4">
      {bookings.map((booking, i) => (
        <motion.div key={booking.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <Link href={`/admin/orders/${booking.id}`}>
            <Card className="hover-elevate cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{booking.user?.name}</p>
                      <span className="text-xs text-muted-foreground">({booking.user?.phone})</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{booking.car?.brand} {booking.car?.model} | {booking.scheduledDate} - {booking.scheduledTime}</p>
                    {booking.address && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {booking.address}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{Number(booking.totalPrice)} ر.س</span>
                    <Badge variant="secondary" className={statusMap[booking.status]?.color}>{statusMap[booking.status]?.label}</Badge>
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function AdminOrderDetail({ id }: { id: string }) {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState("");
  const { data: booking, isLoading } = useQuery<BookingWithDetails>({ queryKey: ["/api/admin/bookings", id] });
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => { await apiRequest("PATCH", `/api/admin/bookings/${id}`, { status: newStatus }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings", id] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] }); toast({ title: "تم تحديث الحالة" }); },
  });
  const updateNotesMutation = useMutation({
    mutationFn: async () => { await apiRequest("PATCH", `/api/admin/bookings/${id}`, { adminNotes }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings", id] }); toast({ title: "تم حفظ الملاحظات" }); },
  });
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-40 w-full" /></div>;
  if (!booking) return null;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 flex-wrap">
        <Link href="/admin/orders"><Button variant="ghost" size="sm" data-testid="button-back-admin-orders">رجوع</Button></Link>
        <h1 className="text-xl font-bold">تفاصيل الطلب</h1>
        <Badge variant="secondary" className={statusMap[booking.status]?.color}>{statusMap[booking.status]?.label}</Badge>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card><CardContent className="p-5 space-y-3"><h3 className="font-bold flex items-center gap-2"><User className="w-4 h-4" /> بيانات العميل</h3><DetailRow label="الاسم" value={booking.user?.name || "-"} /><DetailRow label="الجوال" value={booking.user?.phone || "-"} /></CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card><CardContent className="p-5 space-y-3"><h3 className="font-bold flex items-center gap-2"><CarIcon className="w-4 h-4" /> بيانات السيارة</h3><DetailRow label="الماركة" value={`${booking.car?.brand} ${booking.car?.model}`} /><DetailRow label="اللون" value={booking.car?.color || "-"} /><DetailRow label="اللوحة" value={booking.car?.plateNumber || "-"} /></CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardContent className="p-5 space-y-3"><h3 className="font-bold flex items-center gap-2"><Calendar className="w-4 h-4" /> تفاصيل الحجز</h3><DetailRow label="التاريخ" value={booking.scheduledDate} /><DetailRow label="الوقت" value={booking.scheduledTime} /><DetailRow label="العنوان" value={booking.address || "-"} />{booking.notes && <DetailRow label="ملاحظات العميل" value={booking.notes} />}</CardContent></Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card><CardContent className="p-5 space-y-3"><h3 className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4" /> الخدمات</h3>{booking.services?.map((bs) => (<div key={bs.id} className="flex items-center justify-between gap-2"><span className="text-sm">{bs.service?.name}</span><span className="text-sm font-medium">{Number(bs.price)} ر.س</span></div>))}<div className="border-t pt-2 flex items-center justify-between gap-2"><span className="font-bold">الإجمالي</span><span className="font-bold text-primary">{Number(booking.totalPrice)} ر.س</span></div></CardContent></Card>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card><CardContent className="p-5 space-y-4"><h3 className="font-bold">تحديث الحالة</h3><Select value={booking.status} onValueChange={(val) => updateStatusMutation.mutate(val)}><SelectTrigger data-testid="select-order-status"><SelectValue /></SelectTrigger><SelectContent>{allStatuses.map((s) => (<SelectItem key={s} value={s}>{statusMap[s]?.label}</SelectItem>))}</SelectContent></Select></CardContent></Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card><CardContent className="p-5 space-y-3"><h3 className="font-bold flex items-center gap-2"><StickyNote className="w-4 h-4" /> ملاحظات الإدارة</h3><Textarea value={adminNotes || booking.adminNotes || ""} onChange={(e) => setAdminNotes(e.target.value)} placeholder="ملاحظات لتوجيه المندوب..." data-testid="input-admin-notes" /><Button size="sm" onClick={() => updateNotesMutation.mutate()} disabled={updateNotesMutation.isPending} data-testid="button-save-admin-notes">حفظ الملاحظات</Button></CardContent></Card>
      </motion.div>
      {booking.rating && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card><CardContent className="p-5"><h3 className="font-bold flex items-center gap-2 mb-2"><Star className="w-4 h-4" /> تقييم العميل</h3><div className="flex gap-1 mb-2" dir="ltr">{[1,2,3,4,5].map((s) => (<Star key={s} className={`w-5 h-5 ${s <= booking.rating!.stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />))}</div>{booking.rating.comment && <p className="text-sm text-muted-foreground">{booking.rating.comment}</p>}</CardContent></Card>
        </motion.div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between gap-2"><span className="text-sm text-muted-foreground">{label}</span><span className="text-sm font-medium text-left">{value}</span></div>);
}