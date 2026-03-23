import { Suspense, lazy, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassCard } from '@/components/animations/GlassCard';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { BarChart3, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { getAnalytics, type AnalyticsData } from '@/lib/api';
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

// 3D components removed

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      }
    }
    fetchData();
  }, []);

  // Use fetched data or defaults if loading/failed
  const dailyData = data?.daily || [];
  const weekdayData = data?.weekday || [];
  const seasonalData = data?.seasonal || [];

  // Use monthly data from API (derived from real traffic.csv data)
  const monthlyData = data?.monthly || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

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
                  <h2 className="text-xl font-bold text-foreground">Monthly Traffic Trend</h2>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
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
                        dataKey="traffic"
                        name="Average Vehicles"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
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
