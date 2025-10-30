import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated after loading is complete
    if (!loading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gsf-primary"></div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Checking Authentication
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Please wait while we verify your credentials...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Access Denied
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  You need to be authenticated to access the admin panel.
                </p>
                <Button 
                  onClick={() => setLocation("/admin/login")}
                  className="bg-gsf-secondary hover:bg-gsf-primary"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show unauthorized message if user doesn't have admin privileges
  if (user && !user.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Insufficient Permissions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your account does not have admin privileges.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  Logged in as: {user.email}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => setLocation("/")}
                    size="sm"
                  >
                    Go to Website
                  </Button>
                  <Button 
                    onClick={() => setLocation("/admin/login")}
                    size="sm"
                    className="bg-gsf-secondary hover:bg-gsf-primary"
                  >
                    Switch Account
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and authorized, render the protected content
  return <>{children}</>;
}
