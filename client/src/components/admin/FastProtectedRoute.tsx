import { useLocation } from "wouter";
import { useFastAuth } from "@/hooks/useFastAuth";
import { Loader2 } from "lucide-react";

interface FastProtectedRouteProps {
  children: React.ReactNode;
}

export function FastProtectedRoute({ children }: FastProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useFastAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gsf-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  return <>{children}</>;
}