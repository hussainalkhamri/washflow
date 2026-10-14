import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Car } from "@shared/schema";
import { Car as CarIcon, Plus, Trash2, Palette, Hash } from "lucide-react";
import { motion } from "framer-motion";

const carBrands = [
  "تويوتا", "هيونداي", "كيا", "نيسان", "هوندا", "مرسيدس", "بي إم دبليو",
  "أودي", "لكزس", "شيفروليه", "فورد", "جي إم سي", "دودج", "جيب",
  "لاند روفر", "بورش", "فولكس واجن", "مازدا", "ميتسوبيشي", "سوبارو", "أخرى",
];

const carColors = [
  "أبيض", "أسود", "فضي", "رمادي", "أحمر", "أزرق", "أخضر", "بني", "ذهبي", "بيج", "أخرى",
];

export default function CarsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [year, setYear] = useState("");

  const { data: cars, isLoading } = useQuery<Car[]>({ queryKey: ["/api/cars"] });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cars", { brand, model, color, plateNumber, year });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "تمت إضافة السيارة بنجاح" });
      resetForm();
      setOpen(false);
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إضافة السيارة", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "تم حذف السيارة" });
    },
  });

  const resetForm = () => {
    setBrand(""); setModel(""); setColor(""); setPlateNumber(""); setYear("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative p-6 pb-10">
          <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">سياراتي</h1>
          <p className="text-white/70 text-sm">إدارة سياراتك المسجلة</p>
        </div>
      </div>

      <div className="relative px-4 -mt-4 pb-28">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4 rounded-[0.75rem]" data-testid="button-add-car">
              <Plus className="w-4 h-4 ml-2" />
              إضافة سيارة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة سيارة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>الماركة</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger data-testid="select-brand">
                    <SelectValue placeholder="اختر الماركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الموديل</Label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="مثال: كامري"
                  data-testid="input-model"
                />
              </div>
              <div>
                <Label>اللون</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger data-testid="select-color">
                    <SelectValue placeholder="اختر اللون" />
                  </SelectTrigger>
                  <SelectContent>
                    {carColors.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>رقم اللوحة</Label>
                <Input
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="مثال: أ ب د 1234"
                  data-testid="input-plate"
                />
              </div>
              <div>
                <Label>سنة الصنع (اختياري)</Label>
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="مثال: 2023"
                  data-testid="input-year"
                />
              </div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!brand || !model || !color || !plateNumber || createMutation.isPending}
                className="w-full rounded-[0.75rem]"
                data-testid="button-save-car"
              >
                {createMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="space-y-3">
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[0.75rem] bg-primary/10 flex items-center justify-center">
                          <CarIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold" data-testid={`text-car-name-${car.id}`}>
                            {car.brand} {car.model}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Palette className="w-3 h-3" /> {car.color}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Hash className="w-3 h-3" /> {car.plateNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(car.id)}
                        data-testid={`button-delete-car-${car.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <CarIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">لا توجد سيارات</h3>
                <p className="text-muted-foreground text-sm">أضف سيارتك الأولى لبدء الحجز</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
