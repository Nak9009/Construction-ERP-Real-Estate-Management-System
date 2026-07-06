'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Activity,
  Briefcase,
  Calendar as CalendarIcon,
  Home,
  AlertTriangle,
  Download
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active_projects: 0,
    total_houses: 0,
    houses_completed: 0,
    houses_under_construction: 0,
    delayed_projects: 0,
    total_budget: 0,
    total_expenses: 0,
    budget_used_percentage: 0
  });

  const [projects, setProjects] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [budgetVsActualData, setBudgetVsActualData] = useState([
    { name: 'Green City', budget: 2500000, actual: 1280000 },
    { name: 'Mekong Royal', budget: 4800000, actual: 2900000 },
    { name: 'Sen Sok', budget: 1500000, actual: 150000 },
  ]);

  const chartConfig = {
    budget: {
      label: 'Planned Budget',
      color: 'hsl(var(--chart-1))',
    },
    actual: {
      label: 'Actual Expenses',
      color: 'hsl(var(--chart-2))',
    },
  };

  useEffect(() => {
    // Attempt to load live data if authenticated
    const fetchDashboardData = async () => {
      try {
        const [res, projectsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/projects')
        ]);
        
        if (res.data) {
          if (res.data.widgets) {
            setStats(res.data.widgets);
          }
          if (res.data.charts?.project_budget_vs_actual) {
            setBudgetVsActualData(res.data.charts.project_budget_vs_actual);
          }
        }
        
        if (projectsRes.data?.data) {
          setProjects(projectsRes.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch live dashboard stats, fallback to mock data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="hidden sm:flex w-[260px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Budget Cap
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(stats.total_budget / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Projects
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active_projects}</div>
                  <p className="text-xs text-muted-foreground">
                    1 project delayed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_houses}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.houses_completed} completed units
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Budget Used
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.budget_used_percentage}%</div>
                  <p className="text-xs text-muted-foreground">
                    +4% since last quarter
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Budget vs Actual</CardTitle>
                  <CardDescription>
                    Comparing planned budget vs actual expenses across projects.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <BarChart data={budgetVsActualData}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                      <Bar dataKey="budget" fill="var(--color-budget)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>
                    Status of currently running construction projects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {projects.map((proj) => (
                      <div key={proj.id} className="flex items-center">
                        <Avatar className="h-9 w-9 bg-primary/10">
                          <AvatarFallback className="text-primary font-bold">{proj.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1 w-full">
                          <p className="text-sm font-medium leading-none">{proj.name}</p>
                          <p className="text-sm text-muted-foreground truncate w-48">
                            {proj.address}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {proj.status === 'in_progress' ? (
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">In Progress</Badge>
                          ) : proj.status === 'delayed' ? (
                            <Badge variant="outline" className="text-rose-500 border-rose-500/30">Delayed</Badge>
                          ) : (
                            <Badge variant="outline">Planning</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Analytics content goes here.</p>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="space-y-4">
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Projects content goes here.</p>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">Reports content goes here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
