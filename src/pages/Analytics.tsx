import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

// Mock data for charts
const dailyData = [
  { date: 'Jan 1', traffic: 2340 },
  { date: 'Jan 2', traffic: 2890 },
  { date: 'Jan 3', traffic: 3200 },
  { date: 'Jan 4', traffic: 2980 },
  { date: 'Jan 5', traffic: 3450 },
  { date: 'Jan 6', traffic: 2100 },
  { date: 'Jan 7', traffic: 1890 },
  { date: 'Jan 8', traffic: 2567 },
  { date: 'Jan 9', traffic: 3120 },
  { date: 'Jan 10', traffic: 3450 },
  { date: 'Jan 11', traffic: 3210 },
  { date: 'Jan 12', traffic: 2890 },
  { date: 'Jan 13', traffic: 2100 },
  { date: 'Jan 14', traffic: 1950 },
];

const weekdayData = [
  { day: 'Monday', traffic: 3200, avg: 3100 },
  { day: 'Tuesday', traffic: 3450, avg: 3300 },
  { day: 'Wednesday', traffic: 3380, avg: 3250 },
  { day: 'Thursday', traffic: 3520, avg: 3400 },
  { day: 'Friday', traffic: 3780, avg: 3600 },
  { day: 'Saturday', traffic: 2100, avg: 2000 },
  { day: 'Sunday', traffic: 1850, avg: 1800 },
];

const seasonalData = [
  { season: 'Spring', traffic: 2890, predicted: 2850 },
  { season: 'Summer', traffic: 3120, predicted: 3100 },
  { season: 'Fall', traffic: 3340, predicted: 3300 },
  { season: 'Winter', traffic: 2450, predicted: 2500 },
];

const monthlyTrend = [
  { month: 'Jan', current: 2800, lastYear: 2650 },
  { month: 'Feb', current: 2950, lastYear: 2780 },
  { month: 'Mar', current: 3100, lastYear: 2900 },
  { month: 'Apr', current: 3250, lastYear: 3050 },
  { month: 'May', current: 3400, lastYear: 3200 },
  { month: 'Jun', current: 3300, lastYear: 3100 },
  { month: 'Jul', current: 2900, lastYear: 2750 },
  { month: 'Aug', current: 2850, lastYear: 2700 },
  { month: 'Sep', current: 3200, lastYear: 3000 },
  { month: 'Oct', current: 3350, lastYear: 3150 },
  { month: 'Nov', current: 3100, lastYear: 2950 },
  { month: 'Dec', current: 2700, lastYear: 2550 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Traffic Analytics
            </h1>
            <p className="text-lg text-muted-foreground">
              Visualize traffic patterns and trends over time
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 mt-4 md:mt-0">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6">
          {/* Daily Traffic Trend */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Daily Traffic Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="traffic"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTraffic)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weekday Distribution */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Weekday Traffic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekdayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="day" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="traffic" 
                        name="Current Period"
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="avg" 
                        name="Average"
                        fill="hsl(var(--secondary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Analysis */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Seasonal Traffic Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seasonalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="season" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="traffic" 
                        name="Actual"
                        fill="hsl(var(--chart-1))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="predicted" 
                        name="Predicted"
                        fill="hsl(var(--chart-2))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Monthly Comparison (Current vs Last Year)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="current"
                      name="Current Year"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lastYear"
                      name="Last Year"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
