import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  ArrowUpRight,
  Users,
  ShoppingCart,
  CreditCard,
  Activity,
  LineChart,
  PieChart,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  Filter
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  // Placeholder data for stats
  const stats = [
    {
      title: 'Total Users',
      value: '4,231',
      change: '+12.3%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Sales',
      value: '$45.2k',
      change: '+5.1%',
      trend: 'up',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: 'Revenue',
      value: '$21.5k',
      change: '-2.3%',
      trend: 'down',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: 'Active Sessions',
      value: '2,431',
      change: '+11.9%',
      trend: 'up',
      icon: <Activity className="h-5 w-5" />
    }
  ];

  // Placeholder data for recent activities
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'created a new project',
      project: 'Marketing Campaign',
      time: '2 hours ago',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      user: 'Sarah Kim',
      action: 'completed task',
      project: 'UI Redesign',
      time: '4 hours ago',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'added new comment',
      project: 'Sales Dashboard',
      time: '5 hours ago',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      user: 'Emily Chen',
      action: 'uploaded files',
      project: 'Q2 Report',
      time: '6 hours ago',
      avatar: '👩‍🔬'
    }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header with search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title', 'Dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle', 'Welcome to ReactUltra admin dashboard')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t('common.search', 'Search...')}
              className="pl-8 h-9 w-[180px] lg:w-[240px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Button size="sm" variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">{t('common.notifications', 'Notifications')}</span>
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">{t('common.today', 'Today')}</span>
          </Button>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {/* Date filter */}
      <div className="flex justify-between items-center">
        <Tabs defaultValue="week" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="day">{t('common.day', 'Day')}</TabsTrigger>
            <TabsTrigger value="week">{t('common.week', 'Week')}</TabsTrigger>
            <TabsTrigger value="month">{t('common.month', 'Month')}</TabsTrigger>
            <TabsTrigger value="year">{t('common.year', 'Year')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          {t('common.filter', 'Filter')}
        </Button>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  {stat.icon}
                </div>
                {stat.trend === 'up' ? (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    {stat.change}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    <ArrowUpRight className="mr-1 h-3 w-3 transform rotate-180" />
                    {stat.change}
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{t(`dashboard.${stat.title.toLowerCase().replace(' ', '')}`, stat.title)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-2 overflow-hidden border-none shadow-md">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('dashboard.revenueOverTime', 'Revenue Over Time')}
                </CardTitle>
                <CardDescription>
                  {t('dashboard.revenueDescription', 'Monthly revenue for the current year')}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">{t('common.export', 'Export')}</Button>
                <Button size="sm">{t('common.details', 'Details')}</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[360px] flex items-center justify-center p-6">
            <div className="text-muted-foreground relative w-full h-full">
              {/* Chart would be rendered here in a real application */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <BarChart3 className="h-20 w-20 opacity-50" />
                <p className="mt-2 text-center text-sm">{t('dashboard.chartPlaceholder', 'Chart visualization here')}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-background to-transparent opacity-25"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="pb-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                {t('dashboard.trafficSources', 'Traffic Sources')}
              </CardTitle>
              <CardDescription>
                {t('dashboard.trafficDescription', 'User acquisition channels')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[360px] flex items-center justify-center p-6">
            <div className="text-muted-foreground relative w-full h-full">
              {/* Chart would be rendered here in a real application */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <PieChart className="h-20 w-20 opacity-50" />
                <p className="mt-2 text-center text-sm">{t('dashboard.chartPlaceholder', 'Chart visualization here')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity section */}
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('dashboard.recentActivity', 'Recent Activity')}</CardTitle>
            <Button variant="outline" size="sm">
              {t('common.viewAll', 'View All')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg transition-colors hover:bg-muted/50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.project}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  {t('common.view', 'View')}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;