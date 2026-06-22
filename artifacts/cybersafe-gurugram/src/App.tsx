import { Switch, Route } from "wouter";
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
import PublicReportPage from "@/features/public/PublicReportPage";
import ComplaintTrackPage from "@/features/public/ComplaintTrackPage";
import LoginPage from "@/features/auth/LoginPage";
import AdminOverviewPage from "@/features/admin/overview/AdminOverviewPage";
import AdminMapPage from "@/features/admin/map/AdminMapPage";
import AdminAnalyticsPage from "@/features/admin/analytics/AdminAnalyticsPage";
import AdminComplaintsPage from "@/features/admin/complaints/AdminComplaintsPage";
import AdminConfigPage from "@/features/admin/config/AdminConfigPage";
import AdminUsersPage from "@/features/admin/users/AdminUsersPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={LoginPage} />

            <Route path="/admin">
              {() => (
                <AdminLayout>
                  <AdminOverviewPage />
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/map">
              {() => (
                <AdminLayout>
                  <AdminMapPage />
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/analytics">
              {() => (
                <AdminLayout>
                  <AdminAnalyticsPage />
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/complaints">
              {() => (
                <AdminLayout>
                  <AdminComplaintsPage />
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/config">
              {() => (
                <AdminLayout>
                  <AdminConfigPage />
                </AdminLayout>
              )}
            </Route>
            <Route path="/admin/users">
              {() => (
                <AdminLayout>
                  <AdminUsersPage />
                </AdminLayout>
              )}
            </Route>

            <Route path="/map">
              {() => (
                <PublicLayout>
                  <PublicMapPage />
                </PublicLayout>
              )}
            </Route>
            <Route path="/awareness">
              {() => (
                <PublicLayout>
                  <AwarenessPage />
                </PublicLayout>
              )}
            </Route>
            <Route path="/how-to-report">
              {() => (
                <PublicLayout>
                  <HowToReportPage />
                </PublicLayout>
              )}
            </Route>
            <Route path="/report">
              {() => (
                <PublicLayout>
                  <PublicReportPage />
                </PublicLayout>
              )}
            </Route>
            <Route path="/track">
              {() => (
                <PublicLayout>
                  <ComplaintTrackPage />
                </PublicLayout>
              )}
            </Route>
            <Route path="/">
              {() => (
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              )}
            </Route>
            <Route>
              {() => (
                <PublicLayout>
                  <NotFound />
                </PublicLayout>
              )}
            </Route>
          </Switch>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
