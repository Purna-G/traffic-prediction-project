import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, Loader2, MapPin, ArrowRight } from 'lucide-react';
import { JunctionPredictionInput, JunctionPredictionResult, predictJunctionVehicles } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface JunctionPredictionFormProps {
  onResult: (result: JunctionPredictionResult) => void;
}

export function JunctionPredictionForm({ onResult }: JunctionPredictionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sourceJunction, setSourceJunction] = useState<string>('');
  const [destJunction, setDestJunction] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');

  const triggerPrediction = async (src: string, dst: string) => {
    if (!src || !dst) {
      return;
    }

    if (src === dst) {
      return;
    }

    setIsLoading(true);

    try {
      const input: JunctionPredictionInput = {
        source_junction: parseInt(src),
        dest_junction: parseInt(dst),
        date,
        time,
      };

      const result = await predictJunctionVehicles(input);
      onResult(result);

      toast({
        title: 'Junction Prediction Complete',
        description: `Total vehicles in route: ${Math.round(result.total_vehicle_count)}`,
      });
    } catch (error) {
      toast({
        title: 'Prediction Failed',
        description: error instanceof Error ? error.message : 'Unable to generate prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerPrediction(sourceJunction, destJunction);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Junction Vehicle Prediction
        </CardTitle>
        <CardDescription>
          Predict average vehicle count between two traffic junctions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-junction">Source Junction</Label>
              <Select value={sourceJunction} onValueChange={(value) => {
                setSourceJunction(value);
                // Trigger dynamic prediction when both junctions are selected and different
                if (destJunction && value !== destJunction) {
                  triggerPrediction(value, destJunction);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source junction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Junction 1</SelectItem>
                  <SelectItem value="2">Junction 2</SelectItem>
                  <SelectItem value="3">Junction 3</SelectItem>
                  <SelectItem value="4">Junction 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dest-junction">Destination Junction</Label>
              <Select value={destJunction} onValueChange={(value) => {
                setDestJunction(value);
                // Trigger dynamic prediction when both junctions are selected and different
                if (sourceJunction && sourceJunction !== value) {
                  triggerPrediction(sourceJunction, value);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination junction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Junction 1</SelectItem>
                  <SelectItem value="2">Junction 2</SelectItem>
                  <SelectItem value="3">Junction 3</SelectItem>
                  <SelectItem value="4">Junction 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Predict Junction Vehicles
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}