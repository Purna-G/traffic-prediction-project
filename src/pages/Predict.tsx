import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import { PredictionResult } from '@/components/prediction/PredictionResult';
import { type PredictionInput, type PredictionResult as PredictionResultType } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function Predict() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResultType | null>(null);

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
      <div className="container py-8 lg:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Traffic Volume Prediction
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter weather conditions, date, and time to get an ML-powered traffic volume forecast.
            </p>
          </div>
          
          <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
          
          {result && <PredictionResult result={result} />}
        </div>
      </div>
    </Layout>
  );
}
