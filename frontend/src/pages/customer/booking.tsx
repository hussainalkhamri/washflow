import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { Car, Service } from "@shared/schema";
import { CalendarDays, Car as CarIcon, Sparkles, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

export default function BookingPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedMainService, setSelectedMainService] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: cars, isLoading: carsLoading } = useQuery<Car[]>({ queryKey: ["/api/cars"] });
  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({ queryKey: ["/api/services"] });

  const mainServices = services?.filter((s) => s.category === "main" && s.isActive) || [];
  const extraServices = services?.filter((s) => s.category === "extra" && s.isActive) || [];

  const totalPrice = useMemo(() => {
    let total = 0;
    const mainSvc = mainServices.find((s) => s.id === selectedMainService);
    if (mainSvc) total += Number(mainSvc.price);
    selectedExtras.forEach((id) => {
      const extra = extraServices.find((s) => s.id === id);
      if (extra) total += Number(extra.price);
    });
    return total;
  }, [selectedMainService, selectedExtras, mainServices, extraServices]);

  const bookMutation = useMutation({
    mutationFn: async () => {
      const serviceIds = [selectedMainService, ...selectedExtras];
      await apiRequest("POST", "/api/bookings", {
        carId: selectedCar,
        serviceIds,
        scheduledDate: selectedDate?.toISOString().split("T")[0],
        scheduledTime: selectedTime,
        address,
        notes,
        totalPrice: totalPrice.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setSuccess(true);
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إنشاء الحجز", variant: "destructive" });
    },
  });

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background gradient-mesh p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">تم الحجز بنجاح!</h2>
              <p className="text-muted-foreground mb-6">سنتواصل معك لتأكيد الموعد</p>
              <div className="space-y-3">
                <Button onClick={() => setLocation("/customer")} className="w-full rounded-[0.75rem]" data-testid="button-go-home">
                  الصفحة الرئيسية
                </Button>
                <Button variant="outline" onClick={() => setLocation("/customer/orders")} className="w-full rounded-[0.75rem]" data-testid="button-go-orders">
                  عرض طلباتي
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (carsLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pt-20">
        <div className="space-y-4 max-w-lg mx-auto">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 pb-10">
          <h1 className="text-2xl font-bold text-white">حجز خدمة</h1>
          <p className="text-white/70 text-sm">الخطوة {step} من 4</p>
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3, 4].map((s) => (
              <motion.div
                key={s}
                className="h-1 flex-1 rounded-full overflow-hidden bg-white/20"
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: s <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-4 -mt-4 pb-28 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CarIcon className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg">اختر السيارة</h2>
                  </div>
                  {cars && cars.length > 0 ? (
                    <div className="space-y-2">
                      {cars.map((car) => (
                        <button
                          key={car.id}
                          onClick={() => setSelectedCar(car.id)}
                          className={`w-full text-right p-3 rounded-[0.75rem] border-2 transition-all duration-200 ${
                            selectedCar === car.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border"
                          }`}
                          data-testid={`button-select-car-${car.id}`}
                        >
                          <p className="font-semibold">{car.brand} {car.model}</p>
                          <p className="text-xs text-muted-foreground">{car.color} - {car.plateNumber}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm mb-3">لا توجد سيارات مسجلة</p>
                      <Button variant="outline" onClick={() => setLocation("/customer/cars")} data-testid="button-add-car-first">
                        إضافة سيارة أولاً
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedCar}
                className="w-full rounded-[0.75rem]"
                data-testid="button-next-step-1"
              >
                التالي
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg">اختر الخدمة الرئيسية</h2>
                  </div>
                  <div className="space-y-2">
                    {mainServices.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => setSelectedMainService(svc.id)}
                        className={`w-full text-right p-3 rounded-[0.75rem] border-2 transition-all duration-200 ${
                          selectedMainService === svc.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border"
                        }`}
                        data-testid={`button-select-service-${svc.id}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{svc.name}</p>
                          <Badge variant="secondary">{Number(svc.price)} ريال</Badge>
                        </div>
                        {svc.description && (
                          <p className="text-xs text-muted-foreground mt-1">{svc.description}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {extraServices.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="font-bold text-lg">خدمات إضافية (اختياري)</h2>
                    </div>
                    <div className="space-y-3">
                      {extraServices.map((svc) => (
                        <label
                          key={svc.id}
                          className="flex items-center gap-3 p-3 rounded-[0.75rem] border cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={selectedExtras.includes(svc.id)}
                            onCheckedChange={(checked) => {
                              setSelectedExtras((prev) =>
                                checked ? [...prev, svc.id] : prev.filter((id) => id !== svc.id)
                              );
                            }}
                            data-testid={`checkbox-extra-${svc.id}`}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{svc.name}</p>
                            {svc.description && (
                              <p className="text-xs text-muted-foreground">{svc.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary">{Number(svc.price)} ريال</Badge>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-[0.75rem]">رجوع</Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedMainService}
                  className="flex-1 rounded-[0.75rem]"
                  data-testid="button-next-step-2"
                >
                  التالي
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg">اختر الموعد</h2>
                  </div>
                  <div dir="ltr" className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      data-testid="calendar-date"
                    />
                  </div>
                </CardContent>
              </Card>

              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-bold mb-3">اختر الوقت</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="rounded-[0.5rem]"
                            data-testid={`button-time-${time}`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg">الموقع</h2>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>العنوان</Label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="مثال: حي الملقا، شارع الأمير محمد بن سلمان"
                        data-testid="input-address"
                      />
                    </div>
                    <div>
                      <Label>ملاحظات إضافية (اختياري)</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="مثال: الباب الثاني على اليمين"
                        data-testid="input-notes"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-[0.75rem]">رجوع</Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime || !address}
                  className="flex-1 rounded-[0.75rem]"
                  data-testid="button-next-step-3"
                >
                  التالي
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg">ملخص الطلب</h2>
                  </div>
                  <div className="space-y-3">
                    <SummaryRow label="السيارة" value={(() => { const car = cars?.find(c => c.id === selectedCar); return car ? `${car.brand} ${car.model}` : ""; })()} />
                    <SummaryRow label="الخدمة" value={mainServices.find(s => s.id === selectedMainService)?.name || ""} />
                    {selectedExtras.length > 0 && (
                      <SummaryRow label="إضافات" value={selectedExtras.map(id => extraServices.find(s => s.id === id)?.name).join(", ")} />
                    )}
                    <SummaryRow label="التاريخ" value={selectedDate?.toLocaleDateString("ar-SA") || ""} />
                    <SummaryRow label="الوقت" value={selectedTime} />
                    <SummaryRow label="العنوان" value={address} />
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-lg font-bold">الإجمالي</span>
                        <span className="text-lg font-bold text-primary" data-testid="text-total-price">{totalPrice} ريال</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 rounded-[0.75rem]">رجوع</Button>
                <Button
                  onClick={() => bookMutation.mutate()}
                  disabled={bookMutation.isPending}
                  className="flex-1 rounded-[0.75rem]"
                  data-testid="button-confirm-booking"
                >
                  {bookMutation.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-left">{value}</span>
    </div>
  );
}
