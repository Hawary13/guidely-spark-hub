import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { FastProtectedRoute } from "@/components/admin/FastProtectedRoute";
import { CleanAdminLayout } from "@/components/admin/CleanAdminLayout";

// Public pages
import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Programs from "@/pages/Programs";
// import ProgramDetail from "@/pages/ProgramDetail";
// import ProjectDetail from "@/pages/ProjectDetail";
// Removed Impact public page
// import Impact from "@/pages/Impact";
import OptimizedEvents from "@/pages/OptimizedEvents";
import EventDetail from "@/pages/EventDetail";
import Join from "@/pages/Join";
import NotFound from "@/pages/not-found";

// Admin pages
import FastLogin from "@/pages/admin/FastLogin";
import AdminDashboard from "@/pages/admin/Dashboard";
import PagesEditor from "@/pages/admin/PagesEditor";
import ProgramsManager from "@/pages/admin/ProgramsManager";
import ProjectsManager from "@/pages/admin/ProjectsManager";
import EventsManager from "@/pages/admin/EventsManager";
import SuccessStoriesManager from "@/pages/admin/SuccessStoriesManager";
import StatisticsManager from "@/pages/admin/StatisticsManager";
import UserManager from "@/pages/admin/UserManager";
import HeroSectionManager from "@/pages/admin/HeroSectionManager";
import AboutSectionManager from "@/pages/admin/AboutSectionManager";
import MissionVisionManager from "@/pages/admin/MissionVisionManager";
import TeamManager from "@/pages/admin/TeamManager";
import PartnersManager from "@/pages/admin/PartnersManager";
import UnSdgsManager from "@/pages/admin/UnSdgsManager";
import ImpactPageManager from "@/pages/admin/ImpactPageManager";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      
      {/* Removed public Impact route */}
      
      <Route path="/events">
        <PublicLayout>
          <OptimizedEvents />
        </PublicLayout>
      </Route>
      
      <Route path="/events/:id">
        <PublicLayout>
          <EventDetail />
        </PublicLayout>
      </Route>
      
      <Route path="/join">
        <PublicLayout>
          <Join />
        </PublicLayout>
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login">
        <FastLogin />
      </Route>
      
      {/* Protected Admin Routes with Persistent Layout */}
      <Route path="/admin">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <AdminDashboard />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/hero">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <HeroSectionManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/about">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <AboutSectionManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/mission">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <MissionVisionManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/un-sdgs">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <UnSdgsManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/pages">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <PagesEditor />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/programs">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <ProgramsManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/projects">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <ProjectsManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/events">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <EventsManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/success-stories">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <SuccessStoriesManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/statistics">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <StatisticsManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/users">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <UserManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/team">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <TeamManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/partners">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <PartnersManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>
      
      <Route path="/admin/impact">
        <FastProtectedRoute>
          <CleanAdminLayout>
            <ImpactPageManager />
          </CleanAdminLayout>
        </FastProtectedRoute>
      </Route>

      {/* Fallback to 404 */}
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;