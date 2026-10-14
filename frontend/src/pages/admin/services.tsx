import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Service } from "@shared/schema";
import { Sparkles, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminServicesPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("main");
  const [isActive, setIsActive] = useState(true);
  const { data: services, isLoading } = useQuery<Service[]>({ queryKey: ["/api/admin/services"] });
  const mainServices = services?.filter((s) => s.category === "main") || [];
  const extraServices = services?.filter((s) => s.category === "extra") || [];
  const createMutation = useMutation({
    mutationFn: async () => {
      if (editingService) { await apiRequest("PATCH", `/api/admin/services/${editingService.id}`, { name, description, price, category, isActive }); }
      else { await apiRequest("POST", "/api/admin/services", { name, description, price, category, isActive }); }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] }); queryClient.invalidateQueries({ queryKey: ["/api/services"] }); toast({ title: editingService ? "تم تحديث الخدمة" : "تمت إضافة الخدمة" }); resetForm(); setOpen(false); },
    onError: () => { toast({ title: "خطأ", description: "فشل في حفظ الخدمة", variant: "destructive" }); },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/admin/services/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] }); queryClient.invalidateQueries({ queryKey: ["/api/services"] }); toast({ title: "تم حذف الخدمة" }); },
  });
  const resetForm = () => { setName(""); setDescription(""); setPrice(""); setCategory("main"); setIsActive(true); setEditingService(null); };
  const openEdit = (svc: Service) => { setEditingService(svc); setName(svc.name); setDescription(svc.description || ""); setPrice(String(svc.price)); setCategory(svc.category); setIsActive(svc.isActive); setOpen(true); };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-admin-services-title">إدارة الخدمات</h1>
          <p className="text-muted-foreground text-sm">إضافة وتعديل الخدمات والأسعار</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button data-testid="button-add-service"><Plus className="w-4 h-4 ml-2" />إضافة خدمة</Button></DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>اسم الخدمة</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: غسيل خارجي" data-testid="input-service-name" /></div>
              <div><Label>الوصف (اختياري)</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف مختصر" data-testid="input-service-desc" /></div>
              <div><Label>السعر (ريال)</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="50" dir="ltr" data-testid="input-service-price" /></div>
              <div><Label>التصنيف</Label><Select value={category} onValueChange={setCategory}><SelectTrigger data-testid="select-service-category"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="main">خدمة رئيسية</SelectItem><SelectItem value="extra">خدمة إضافية</SelectItem></SelectContent></Select></div>
              <div className="flex items-center justify-between gap-2"><Label>نشطة</Label><Switch checked={isActive} onCheckedChange={setIsActive} data-testid="switch-active" /></div>
              <Button onClick={() => createMutation.mutate()} disabled={!name || !price || createMutation.isPending} className="w-full rounded-[0.75rem]" data-testid="button-save-service">{createMutation.isPending ? "جاري الحفظ..." : "حفظ"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
      {isLoading ? (<div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20 rounded-md" />)}</div>) : (<><ServiceGroup title="الخدمات الرئيسية" services={mainServices} onEdit={openEdit} onDelete={(id) => deleteMutation.mutate(id)} /><ServiceGroup title="الخدمات الإضافية" services={extraServices} onEdit={openEdit} onDelete={(id) => deleteMutation.mutate(id)} /></>)}
    </div>
  );
}

function ServiceGroup({ title, services, onEdit, onDelete }: { title: string; services: Service[]; onEdit: (s: Service) => void; onDelete: (id: string) => void; }) {
  if (services.length === 0) return null;
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="space-y-3">
        {services.map((svc, i) => (
          <motion.div key={svc.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[0.75rem] bg-primary/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="flex items-center gap-2"><p className="font-bold">{svc.name}</p>{!svc.isActive && <Badge variant="secondary" className="text-xs">معطلة</Badge>}</div>
                      {svc.description && <p className="text-xs text-muted-foreground">{svc.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{Number(svc.price)} ريال</Badge>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(svc)} data-testid={`button-edit-service-${svc.id}`}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(svc.id)} data-testid={`button-delete-service-${svc.id}`}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
