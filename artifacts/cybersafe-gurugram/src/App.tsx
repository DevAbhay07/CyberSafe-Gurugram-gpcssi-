import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/AuthProvider";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import HomePage from "@/features/public/HomePage";
import PublicMapPage from "@/features/public/PublicMapPage";
import AwarenessPage from "@/features/public/AwarenessPage";
import HowToReportPage from "@/features/public/HowToReportPage";
import LoginPage from "@/features/auth/LoginPage";
import AdminOverviewPage from "@/features/admin/overview/AdminOverviewPage";
import AdminMapPage from "@/features/admin/map/AdminMapPage";
import AdminAnalyticsPage from "@/features/admin/analytics/AdminAnalyticsPage";
import AdminComplaintsPage from "@/features/admin/complaints/AdminComplaintsPage";
import AdminConfigPage from "@/features/admin/config/AdminConfigPage";
import AdminUsersPage from "@/features/admin/users/AdminUsersPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function PublicRoutes() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/map" component={PublicMapPage} />
        <Route path="/awareness" component={AwarenessPage} />
        <Route path="/how-to-report" component={HowToReportPage} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminOverviewPage} />
        <Route path="/admin/map" component={AdminMapPage} />
        <Route path="/admin/analytics" component={AdminAnalyticsPage} />
        <Route path="/admin/complaints" component={AdminComplaintsPage} />
        <Route path="/admin/config" component={AdminConfigPage} />
        <Route path="/admin/users" component={AdminUsersPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/admin/:rest*" component={AdminRoutes} />
      <Route path="/:rest*" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
