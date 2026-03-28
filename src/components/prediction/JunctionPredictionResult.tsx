import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, TrendingUp, MapPin, Clock, Calendar } from 'lucide-react';
import { JunctionPredictionResult } from '@/lib/api';

interface JunctionPredictionResultProps {
  result: JunctionPredictionResult;
}

const trafficLevelColors = {
  Low: 'bg-green-100 text-green-800 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  High: 'bg-red-100 text-red-800 border-red-200',
};

export function JunctionPredictionResultComponent({ result }: JunctionPredictionResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Junction Vehicle Prediction Result
          </CardTitle>
          <CardDescription>
            Average vehicle count between Junction {result.source_junction} and Junction {result.dest_junction}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Main Result */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Junction {result.source_junction} → Junction {result.dest_junction}
                </span>
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {Math.round(result.total_vehicle_count)}
              </div>
              <p className="text-sm text-muted-foreground">Total Vehicles in Route</p>
            </div>

            {/* Traffic Level Badge */}
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium ${trafficLevelColors[result.traffic_level]}`}
              >
                {result.traffic_level} Traffic
              </Badge>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">Source Junction {result.source_junction}</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(result.source_vehicle_count)}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">Vehicles</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-semibold text-red-700">Destination Junction {result.dest_junction}</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {Math.round(result.dest_vehicle_count)}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">Vehicles</p>
                  </CardContent>
                </Card>
              </div>

              {/* Intermediate Junctions */}
              {result.intermediate_junctions && result.intermediate_junctions.length > 0 && (
                <Card className="border-t-4 border-t-orange-500/50">
                  <CardHeader>
                    <CardTitle className="text-base">In-Between Junctions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.intermediate_junctions.map((junc) => (
                        <div key={junc.junction} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <span className="text-sm font-medium">Junction {junc.junction}</span>
                          <span className="text-lg font-bold text-orange-600">{Math.round(junc.vehicle_count)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Date/Time Info */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{result.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{result.time}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}