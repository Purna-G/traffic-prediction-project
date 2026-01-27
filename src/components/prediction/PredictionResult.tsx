import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrafficLevelBadge } from '@/components/ui/traffic-level-badge';
import { Car, TrendingUp, Gauge } from 'lucide-react';
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
    <Card className="border-border shadow-lg overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="h-6 w-6 text-primary" />
          Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <Car className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predicted Vehicle Count</p>
                <p className="text-3xl font-bold text-foreground">{result.vehicle_count.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: levelColors[result.traffic_level] }}
              >
                <Gauge className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Traffic Level</p>
                <TrafficLevelBadge level={result.traffic_level} className="mt-1" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Model Confidence</p>
                <span className="text-lg font-bold text-foreground">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {result.confidence >= 80 ? 'High confidence prediction' : 
                 result.confidence >= 60 ? 'Moderate confidence prediction' : 
                 'Lower confidence - consider additional factors'}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col items-center justify-center">
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
                      borderRadius: 'var(--radius)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
