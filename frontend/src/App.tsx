import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import WelcomePage from "@/pages/welcome";
import CustomerHome from "@/pages/customer/home";
import CarsPage from "@/pages/customer/cars";
import BookingPage from "@/pages/customer/booking";
import OrdersPage from "@/pages/customer/orders";
import ProfilePage from "@/pages/customer/profile";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminCustomersPage from "@/pages/admin/customers";
import AdminServicesPage from "@/pages/admin/services";
import AdminReportsPage from "@/pages/admin/reports";
import CustomerLayout from "@/components/customer-layout";
import AdminLayout from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeProvider } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets } from "lucide-react";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
};

function AdminRoutes() {
  const [location] = useLocation();
  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <motion.div key={location} {...pageTransition} className="w-full h-full">
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/orders" component={AdminOrdersPage} />
            <Route path="/admin/orders/:id" component={AdminOrdersPage} />
            <Route path="/admin/customers" component={AdminCustomersPage} />
            <Route path="/admin/services" component={AdminServicesPage} />
            <Route path="/admin/reports" component={AdminReportsPage} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
}

function CustomerRoutes() {
  const [location] = useLocation();
  return (
    <CustomerLayout>
      <AnimatePresence mode="wait">
        <motion.div key={location} {...pageTransition} className="w-full h-full">
          <Switch>
            <Route path="/" component={CustomerHome} />
            <Route path="/customer" component={CustomerHome} />
            <Route path="/customer/cars" component={CarsPage} />
            <Route path="/customer/book" component={BookingPage} />
            <Route path="/customer/orders" component={OrdersPage} />
            <Route path="/customer/orders/:id" component={OrdersPage} />
            <Route path="/customer/profile" component={ProfilePage} />
            <Route component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </CustomerLayout>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background gradient-mesh">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto shadow-lg">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <Skeleton className="h-4 w-32 mx-auto" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <WelcomePage />;
  }

  return location.startsWith("/admin") ? <AdminRoutes /> : <CustomerRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="gaseel-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <AppContent />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
