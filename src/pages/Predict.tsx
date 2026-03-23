import { useState, Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PredictionForm } from '@/components/prediction/PredictionForm';
import { PredictionResult } from '@/components/prediction/PredictionResult';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { type PredictionInput, type PredictionResult as PredictionResultType, predictTraffic } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

// 3D components removed

export default function Predict() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResultType | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePredict = async (input: PredictionInput) => {
    setIsLoading(true);

    try {
      const result = await predictTraffic(input);
      setResult(result);

      toast({
        title: 'Prediction Complete',
        description: `Estimated time: ${result.estimated_duration_min} mins.`,
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

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
