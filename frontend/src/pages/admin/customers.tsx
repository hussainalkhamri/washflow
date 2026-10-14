import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User, Car } from "@shared/schema";
import { Users, Phone, Car as CarIcon, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

interface CustomerWithDetails extends User {
  cars?: Car[];
  bookingCount?: number;
}

export default function AdminCustomersPage() {
  const { data: customers, isLoading } = useQuery<CustomerWithDetails[]>({ queryKey: ["/api/admin/customers"] });
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold" data-testid="text-admin-customers-title">إدارة العملاء</h1>
        <p className="text-muted-foreground text-sm">جميع العملاء المسجلين</p>
      </motion.div>
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 rounded-md" />)}</div>
      ) : customers && customers.length > 0 ? (
        <div className="space-y-3">
          {customers.map((customer, i) => (
            <motion.div key={customer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-bold">{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold" data-testid={`text-customer-name-${customer.id}`}>{customer.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {customer.cars && customer.cars.length > 0 && (<Badge variant="secondary" className="text-xs"><CarIcon className="w-3 h-3 ml-1" /> {customer.cars.length} سيارة</Badge>)}
                        {customer.bookingCount !== undefined && (<Badge variant="secondary" className="text-xs"><ClipboardList className="w-3 h-3 ml-1" /> {customer.bookingCount} طلب</Badge>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card><CardContent className="p-8 text-center"><div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 mx-auto mb-4 flex items-center justify-center"><Users className="w-8 h-8 text-primary" /></div><h3 className="font-bold text-lg mb-2">لا يوجد عملاء</h3><p className="text-muted-foreground text-sm">لم يتم تسجيل أي عميل بعد</p></CardContent></Card>
      )}
    </div>
  );
}
