import { Suspense, lazy, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/animations/GlassCard';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { BarChart3, TrendingUp, Calendar, Sparkles } from 'lucide-react';
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

const ParticleField = lazy(() => import('@/components/3d/ParticleField').then(m => ({ default: m.ParticleField })));

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField className="opacity-20" />
        </Suspense>
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <AnimatedSection>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm text-primary text-sm font-medium mb-4"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              >
                <BarChart3 className="h-4 w-4" />
                Data Insights
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                Traffic{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Analytics
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Visualize traffic patterns and trends over time
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-44 bg-background/50 backdrop-blur-sm border-border/50">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid gap-6">
            {/* Daily Traffic Trend */}
            <AnimatedSection delay={0.1}>
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Daily Traffic Volume</h2>
                </div>
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
                          backdropFilter: 'blur(12px)',
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
              </GlassCard>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekday Distribution */}
              <AnimatedSection delay={0.2}>
                <GlassCard className="p-6" hover={false}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-secondary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Weekday Distribution</h2>
                  </div>
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
                            backdropFilter: 'blur(12px)',
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
                </GlassCard>
              </AnimatedSection>

              {/* Seasonal Analysis */}
              <AnimatedSection delay={0.3}>
                <GlassCard className="p-6" hover={false}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-chart-3/20 to-chart-3/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-chart-3" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Seasonal Analysis</h2>
                  </div>
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
                            backdropFilter: 'blur(12px)',
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
                </GlassCard>
              </AnimatedSection>
            </div>

            {/* Monthly Comparison */}
            <AnimatedSection delay={0.4}>
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-4/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-chart-4" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Monthly Comparison (Current vs Last Year)</h2>
                </div>
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
                          backdropFilter: 'blur(12px)',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="current"
                        name="Current Year"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
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
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
}
