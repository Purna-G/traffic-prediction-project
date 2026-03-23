import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarIcon, Loader2, MapPin, Clock, Calendar as CalendarIcon2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GlassCard } from '@/components/animations/GlassCard';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { type PredictionInput } from '@/lib/api';
import { cn } from '@/lib/utils';

const predictionSchema = z.object({
  from_loc: z.string().min(2, 'Please enter a valid starting location'),
  to_loc: z.string().min(2, 'Please enter a valid destination'),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, 'Please select a time'),
  is_peak_hour: z.boolean().optional(),
  is_holiday: z.boolean().optional(),
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
      from_loc: '',
      to_loc: '',
      is_peak_hour: false,
      is_holiday: false,
      time: '',
    },
  });

  const isPeakHour = watch('is_peak_hour');
  const isHoliday = watch('is_holiday');

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      from_loc: data.from_loc,
      to_loc: data.to_loc,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
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
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Traffic Prediction</h2>
            <p className="text-muted-foreground">Enter route and time details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Location Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Route Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="from_loc" className="flex items-center gap-2">
                  From Location
                </Label>
                <LocationAutocomplete
                  value={watch('from_loc') || ''}
                  onChange={(value) => setValue('from_loc', value)}
                  placeholder="e.g. New York, NY"
                  error={errors.from_loc?.message}
                />
                {errors.from_loc && (
                  <p className="text-sm text-destructive">{errors.from_loc.message}</p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Label htmlFor="to_loc" className="flex items-center gap-2">
                  To Location
                </Label>
                <LocationAutocomplete
                  value={watch('to_loc') || ''}
                  onChange={(value) => setValue('to_loc', value)}
                  placeholder="e.g. Jersey City, NJ"
                  error={errors.to_loc?.message}
                />
                {errors.to_loc && (
                  <p className="text-sm text-destructive">{errors.to_loc.message}</p>
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
                        'w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 h-10',
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
                    "bg-background/50 backdrop-blur-sm border-border/50 h-10",
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
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-gradient-to-br from-warning/5 to-warning/10 backdrop-blur-sm col-span-2 md:col-span-1"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="peak-hour" className="font-medium cursor-pointer">Peak Hour</Label>
                  <p className="text-xs text-muted-foreground">Rush hour traffic</p>
                </div>
                <Switch
                  id="peak-hour"
                  checked={isPeakHour}
                  onCheckedChange={(checked) => setValue('is_peak_hour', checked)}
                />
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-gradient-to-br from-secondary/5 to-secondary/10 backdrop-blur-sm col-span-2 md:col-span-1"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-0.5">
                  <Label htmlFor="holiday" className="font-medium cursor-pointer">Holiday</Label>
                  <p className="text-xs text-muted-foreground">Is it a public holiday?</p>
                </div>
                <Switch
                  id="holiday"
                  checked={isHoliday}
                  onCheckedChange={(checked) => setValue('is_holiday', checked)}
                />
              </motion.div>
            </div>
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
                  <>
                    Predict Route Traffic
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
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
