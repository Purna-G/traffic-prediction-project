import { motion, useReducedMotion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { TrafficLevelBadge } from '@/components/ui/traffic-level-badge';
import { GlassCard } from '@/components/animations/GlassCard';
import { Car, TrendingUp, Gauge, CheckCircle } from 'lucide-react';
import { type PredictionResult as PredictionResultType } from '@/lib/api';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';

interface PredictionResultProps {
  result: PredictionResultType;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const chartData = [
    { name: 'Predicted Volume', value: result.vehicle_count },
    { name: 'Remaining Capacity', value: Math.max(0, 5000 - result.vehicle_count) },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

  const levelColors = {
    Low: 'hsl(var(--secondary))',
    Medium: 'hsl(var(--primary))',
    High: 'hsl(var(--destructive))',
  };

  return (
    <GlassCard className="overflow-hidden" hover={false}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Prediction Results
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <CheckCircle className="h-5 w-5 text-secondary" />
              </motion.span>
            </h2>
            <p className="text-muted-foreground">AI-powered traffic forecast</p>
          </div>
        </motion.div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats */}
          <div className="space-y-6">
            <motion.div 
              className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
                <Car className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predicted Vehicle Count</p>
                <motion.p 
                  className="text-4xl font-bold text-foreground"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {result.vehicle_count.toLocaleString()}
                </motion.p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
            >
              <div 
                className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                style={{ 
                  backgroundColor: levelColors[result.traffic_level],
                  boxShadow: `0 10px 25px -5px ${levelColors[result.traffic_level]}40`
                }}
              >
                <Gauge className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Traffic Level</p>
                <TrafficLevelBadge level={result.traffic_level} className="mt-1 text-lg" />
              </div>
            </motion.div>

            <motion.div 
              className="p-5 rounded-2xl bg-gradient-to-br from-info/5 to-info/10 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">Model Confidence</p>
                <motion.span 
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {result.confidence}%
                </motion.span>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              >
                <Progress value={result.confidence} className="h-3" />
              </motion.div>
              <p className="text-xs text-muted-foreground mt-3">
                {result.confidence >= 80 ? '✨ High confidence prediction' : 
                 result.confidence >= 60 ? '👍 Moderate confidence prediction' : 
                 '⚠️ Lower confidence - consider additional factors'}
              </p>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div 
            className="flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-sm font-medium text-muted-foreground mb-4">Road Capacity Utilization</p>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                      backdropFilter: 'blur(12px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/50" />
                <span className="text-sm text-muted-foreground">Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
