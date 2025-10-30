import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { FirestoreAuthService } from "@/lib/firestoreAuth";
import { CheckCircle, XCircle, AlertCircle, Database, Users, Shield } from "lucide-react";

export default function TestAuth() {
  const [tests, setTests] = useState({
    firestore: { status: 'pending', message: '' },
    admin: { status: 'pending', message: '' },
    login: { status: 'pending', message: '' }
  });
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    
    // Test 1: Firestore Connection
    setTests(prev => ({ ...prev, firestore: { status: 'running', message: 'Testing Firestore connection...' } }));
    try {
      const connectionResult = await FirestoreAuthService.testConnection();
      setTests(prev => ({ 
        ...prev, 
        firestore: { 
          status: connectionResult.success ? 'success' : 'error', 
          message: connectionResult.message
        } 
      }));
    } catch (error: any) {
      setTests(prev => ({ ...prev, firestore: { status: 'error', message: error.message } }));
    }

    // Test 2: Initialize Default Admin
    setTests(prev => ({ ...prev, admin: { status: 'running', message: 'Creating default admin...' } }));
    try {
      const adminResult = await FirestoreAuthService.initializeDefaultAdmin();
      setTests(prev => ({ 
        ...prev, 
        admin: { 
          status: 'success', 
          message: adminResult.success ? 'Default admin ready (admin@gsf.org.eg / admin123)' : adminResult.error || 'Failed'
        } 
      }));
    } catch (error: any) {
      setTests(prev => ({ ...prev, admin: { status: 'error', message: error.message } }));
    }

    // Test 3: Test Login
    setTests(prev => ({ ...prev, login: { status: 'running', message: 'Testing authentication...' } }));
    try {
      const loginResult = await FirestoreAuthService.signIn('admin@gsf.org.eg', 'admin123');
      setTests(prev => ({ 
        ...prev, 
        login: { 
          status: loginResult.success ? 'success' : 'error', 
          message: loginResult.success ? 'Authentication working' : loginResult.error || 'Login failed'
        } 
      }));
      
      if (loginResult.success) {
        // Sign out after test
        await FirestoreAuthService.signOut();
      }
    } catch (error: any) {
      setTests(prev => ({ ...prev, login: { status: 'error', message: error.message } }));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
          Authentication System Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Test Firebase connection and initialize admin authentication
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This test will verify your Firebase connection and set up the admin authentication system.
            Run this once to initialize your admin account.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="bg-gsf-secondary hover:bg-gsf-primary"
        >
          {isRunning ? "Running Tests..." : "Run Authentication Tests"}
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Firestore Database
              </div>
              {getStatusBadge(tests.firestore.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {getStatusIcon(tests.firestore.status)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tests.firestore.message || 'Testing Firestore database connection'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Default Admin Setup
              </div>
              {getStatusBadge(tests.admin.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {getStatusIcon(tests.admin.status)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tests.admin.message || 'Creating default administrator account'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Authentication Test
              </div>
              {getStatusBadge(tests.login.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              {getStatusIcon(tests.login.status)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tests.login.message || 'Testing login with default admin credentials'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {tests.admin.status === 'success' && (
        <div className="mt-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Authentication system is ready!</strong><br />
              Default admin credentials: <code>admin@gsf.org.eg</code> / <code>admin123</code><br />
              You can now log in to the admin panel and create additional users.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}