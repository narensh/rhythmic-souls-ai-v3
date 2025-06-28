import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BarChart3, Clock, Folder, Database } from 'lucide-react';

export function UserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (dashboardLoading) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Dashboard</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Track your usage and activity across our platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back,</p>
              <p className="font-semibold">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </p>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Analytics Cards */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">API Calls</p>
                  <p className="text-2xl font-bold">{stats.apiCalls || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                <span className="inline-block w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-green-600 mr-1"></span>
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sessions</p>
                  <p className="text-2xl font-bold">{stats.sessions || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">
                <span className="inline-block w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-green-600 mr-1"></span>
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Projects</p>
                  <p className="text-2xl font-bold">{stats.projects || 0}</p>
                </div>
                <Folder className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Active this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Storage</p>
                  <p className="text-2xl font-bold">{stats.storage || '0GB'}</p>
                </div>
                <Database className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Of 10GB limit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600 dark:text-slate-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity to display</p>
                <p className="text-sm">Start using our services to see your activity here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
