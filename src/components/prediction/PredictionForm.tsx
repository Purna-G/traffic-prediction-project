import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarIcon, Loader2, Cloud, Clock, Calendar as CalendarIcon2, Thermometer, Droplets, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GlassCard } from '@/components/animations/GlassCard';
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
  const shouldReduceMotion = useReducedMotion();

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
    <GlassCard className="overflow-visible" hover={false}>
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
            <Cloud className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Traffic Prediction</h2>
            <p className="text-muted-foreground">Enter weather and time parameters</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Weather Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cloud className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Weather Conditions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="temperature" className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-destructive" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  className={cn(
                    "bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors",
                    errors.temperature && 'border-destructive'
                  )}
                />
                {errors.temperature && (
                  <p className="text-sm text-destructive">{errors.temperature.message}</p>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="rainfall" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-info" />
                  Rainfall (mm)
                </Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  {...register('rainfall', { valueAsNumber: true })}
                  className={cn(
                    "bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors",
                    errors.rainfall && 'border-destructive'
                  )}
                />
                {errors.rainfall && (
                  <p className="text-sm text-destructive">{errors.rainfall.message}</p>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="snowfall" className="flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-secondary" />
                  Snowfall (cm)
                </Label>
                <Input
                  id="snowfall"
                  type="number"
                  step="0.1"
                  {...register('snowfall', { valueAsNumber: true })}
                  className={cn(
                    "bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-colors",
                    errors.snowfall && 'border-destructive'
                  )}
                />
                {errors.snowfall && (
                  <p className="text-sm text-destructive">{errors.snowfall.message}</p>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  Weather Condition
                </Label>
                <Select onValueChange={(value) => setValue('weather_condition', value)}>
                  <SelectTrigger className={cn(
                    "bg-background/50 backdrop-blur-sm border-border/50",
                    errors.weather_condition && 'border-destructive'
                  )}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
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
              </motion.div>
            </div>
          </div>

          {/* Time Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Date & Time</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label className="flex items-center gap-2">
                  <CalendarIcon2 className="h-4 w-4 text-primary" />
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70',
                        !date && 'text-muted-foreground',
                        errors.date && 'border-destructive'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover/95 backdrop-blur-xl border-border/50" align="start">
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
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary" />
                  Time
                </Label>
                <Select onValueChange={(value) => setValue('time', value)}>
                  <SelectTrigger className={cn(
                    "bg-background/50 backdrop-blur-sm border-border/50",
                    errors.time && 'border-destructive'
                  )}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50 max-h-60">
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
              </motion.div>

              <motion.div 
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Label>Day</Label>
                <Input 
                  value={date ? format(date, 'EEEE') : ''} 
                  disabled 
                  placeholder="Auto-filled"
                  className="bg-muted/50 border-border/50"
                />
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-gradient-to-br from-warning/5 to-warning/10 backdrop-blur-sm"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="peak-hour" className="font-medium">Peak Hour</Label>
                  <p className="text-xs text-muted-foreground">Rush hour traffic</p>
                </div>
                <Switch
                  id="peak-hour"
                  checked={isPeakHour}
                  onCheckedChange={(checked) => setValue('is_peak_hour', checked)}
                />
              </motion.div>
            </div>
          </div>

          {/* Other Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
                <CalendarIcon2 className="h-4 w-4 text-info" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Additional Factors</h3>
            </div>
            
            <motion.div 
              className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10 backdrop-blur-sm max-w-xs"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-0.5">
                <Label htmlFor="holiday" className="font-medium">Holiday</Label>
                <p className="text-xs text-muted-foreground">Is it a public holiday?</p>
              </div>
              <Switch
                id="holiday"
                checked={isHoliday}
                onCheckedChange={(checked) => setValue('is_holiday', checked)}
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <motion.div
              className="flex-1"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  'Predict Traffic'
                )}
              </Button>
            </motion.div>
            
            <motion.div
              className="flex-1"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            >
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset} 
                className="w-full py-6 text-lg rounded-xl bg-background/50 backdrop-blur-sm border-border/50"
              >
                Reset Form
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </GlassCard>
  );
}
