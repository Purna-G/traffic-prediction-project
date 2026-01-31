import { useState, Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import { PredictionResult } from '@/components/prediction/PredictionResult';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { type PredictionInput, type PredictionResult as PredictionResultType } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const ParticleField = lazy(() => import('@/components/3d/ParticleField').then(m => ({ default: m.ParticleField })));

export default function Predict() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResultType | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePredict = async (input: PredictionInput) => {
    setIsLoading(true);
    
    try {
      // Simulate API call for demo purposes
      // In production, replace with actual API call:
      // const result = await predictTraffic(input);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock prediction based on inputs
      const baseCount = 2000;
      const tempFactor = input.temperature > 25 ? 1.1 : input.temperature < 5 ? 0.8 : 1;
      const rainFactor = input.rainfall > 10 ? 0.7 : input.rainfall > 0 ? 0.85 : 1;
      const snowFactor = input.snowfall > 5 ? 0.5 : input.snowfall > 0 ? 0.7 : 1;
      const peakFactor = input.is_peak_hour ? 1.8 : 1;
      const holidayFactor = input.is_holiday ? 0.6 : 1;
      
      const vehicleCount = Math.round(
        baseCount * tempFactor * rainFactor * snowFactor * peakFactor * holidayFactor +
        (Math.random() * 500 - 250)
      );
      
      let trafficLevel: 'Low' | 'Medium' | 'High';
      if (vehicleCount < 1500) trafficLevel = 'Low';
      else if (vehicleCount < 3000) trafficLevel = 'Medium';
      else trafficLevel = 'High';
      
      const mockResult: PredictionResultType = {
        vehicle_count: Math.max(0, vehicleCount),
        traffic_level: trafficLevel,
        confidence: Math.round(75 + Math.random() * 20),
        timestamp: new Date().toISOString(),
      };
      
      setResult(mockResult);
      
      toast({
        title: 'Prediction Complete',
        description: `Expected ${mockResult.vehicle_count.toLocaleString()} vehicles with ${mockResult.traffic_level} traffic.`,
      });
    } catch (error) {
      toast({
        title: 'Prediction Failed',
        description: 'Unable to generate prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField className="opacity-20" />
        </Suspense>
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative z-10">
          <AnimatedSection className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm text-primary text-sm font-medium mb-6"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              ML-Powered Predictions
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Traffic Volume{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Prediction
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter weather conditions, date, and time to get an ML-powered traffic volume forecast.
            </p>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Form & Results Section */}
      <section className="pb-24">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-8">
            <AnimatedSection delay={0.1}>
              <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
            </AnimatedSection>
            
            {result && (
              <AnimatedSection delay={0.2}>
                <PredictionResult result={result} />
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
