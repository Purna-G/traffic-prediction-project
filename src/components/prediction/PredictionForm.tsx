import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WEATHER_CONDITIONS, type PredictionInput } from '@/lib/api';
import { cn } from '@/lib/utils';

const predictionSchema = z.object({
  temperature: z.number().min(-50).max(60),
  rainfall: z.number().min(0).max(500),
  snowfall: z.number().min(0).max(200),
  weather_condition: z.string().min(1, 'Please select a weather condition'),
  date: z.date(),
  time: z.string().min(1, 'Please select a time'),
  is_peak_hour: z.boolean(),
  is_holiday: z.boolean(),
});

type FormData = z.infer<typeof predictionSchema>;

interface PredictionFormProps {
  onSubmit: (data: PredictionInput) => void;
  isLoading: boolean;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [date, setDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      temperature: 20,
      rainfall: 0,
      snowfall: 0,
      weather_condition: '',
      is_peak_hour: false,
      is_holiday: false,
      time: '',
    },
  });

  const isPeakHour = watch('is_peak_hour');
  const isHoliday = watch('is_holiday');

  const handleFormSubmit = (data: FormData) => {
    const dayName = format(data.date, 'EEEE');
    
    onSubmit({
      temperature: data.temperature,
      rainfall: data.rainfall,
      snowfall: data.snowfall,
      weather_condition: data.weather_condition,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      day: dayName,
      is_peak_hour: data.is_peak_hour,
      is_holiday: data.is_holiday,
    });
  };

  const handleReset = () => {
    reset();
    setDate(undefined);
  };

  return (
    <Card className="border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Traffic Prediction</CardTitle>
        <CardDescription>
          Enter weather and time parameters to predict traffic volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Weather Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Weather Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  className={errors.temperature ? 'border-destructive' : ''}
                />
                {errors.temperature && (
                  <p className="text-sm text-destructive">{errors.temperature.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  {...register('rainfall', { valueAsNumber: true })}
                  className={errors.rainfall ? 'border-destructive' : ''}
                />
                {errors.rainfall && (
                  <p className="text-sm text-destructive">{errors.rainfall.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="snowfall">Snowfall (cm)</Label>
                <Input
                  id="snowfall"
                  type="number"
                  step="0.1"
                  {...register('snowfall', { valueAsNumber: true })}
                  className={errors.snowfall ? 'border-destructive' : ''}
                />
                {errors.snowfall && (
                  <p className="text-sm text-destructive">{errors.snowfall.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Weather Condition</Label>
                <Select onValueChange={(value) => setValue('weather_condition', value)}>
                  <SelectTrigger className={errors.weather_condition ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {WEATHER_CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.weather_condition && (
                  <p className="text-sm text-destructive">{errors.weather_condition.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Time Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                        errors.date && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        if (d) setValue('date', d);
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Select onValueChange={(value) => setValue('time', value)}>
                  <SelectTrigger className={errors.time ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-sm text-destructive">{errors.time.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Day</Label>
                <Input 
                  value={date ? format(date, 'EEEE') : ''} 
                  disabled 
                  placeholder="Auto-filled"
                  className="bg-muted"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="peak-hour">Peak Hour</Label>
                  <p className="text-xs text-muted-foreground">Rush hour traffic</p>
                </div>
                <Switch
                  id="peak-hour"
                  checked={isPeakHour}
                  onCheckedChange={(checked) => setValue('is_peak_hour', checked)}
                />
              </div>
            </div>
          </div>

          {/* Other Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Factors</h3>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50 max-w-xs">
              <div className="space-y-0.5">
                <Label htmlFor="holiday">Holiday</Label>
                <p className="text-xs text-muted-foreground">Is it a public holiday?</p>
              </div>
              <Switch
                id="holiday"
                checked={isHoliday}
                onCheckedChange={(checked) => setValue('is_holiday', checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                'Predict Traffic'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
