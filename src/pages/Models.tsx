import { Suspense, lazy, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from '@/components/animations/GlassCard';
import { AnimatedSection, AnimatedCounter } from '@/components/animations/AnimatedSection';
import { toast } from '@/hooks/use-toast';
import { Trophy, RefreshCw, Loader2, TrendingUp, Target, Gauge, Cpu, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const ParticleField = lazy(() => import('@/components/3d/ParticleField').then(m => ({ default: m.ParticleField })));

interface ModelMetrics {
  name: string;
  accuracy: number;
  rmse: number;
  mae: number;
  is_best: boolean;
  description: string;
}

const mockModels: ModelMetrics[] = [
  {
    name: 'Random Forest',
    accuracy: 94.2,
    rmse: 245.8,
    mae: 189.3,
    is_best: true,
    description: 'Ensemble learning method using multiple decision trees for robust predictions.',
  },
  {
    name: 'XGBoost',
    accuracy: 92.8,
    rmse: 278.4,
    mae: 212.6,
    is_best: false,
    description: 'Gradient boosting algorithm optimized for speed and performance.',
  },
  {
    name: 'Linear Regression',
    accuracy: 85.4,
    rmse: 342.1,
    mae: 267.8,
    is_best: false,
    description: 'Simple linear model serving as baseline for comparison.',
  },
  {
    name: 'Neural Network',
    accuracy: 91.6,
    rmse: 295.2,
    mae: 228.4,
    is_best: false,
    description: 'Deep learning model with multiple hidden layers for pattern recognition.',
  },
];

export default function Models() {
  const [isRetraining, setIsRetraining] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleRetrain = async (modelName: string) => {
    setIsRetraining(modelName);
    
    // Simulate retraining
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setIsRetraining(null);
    toast({
      title: 'Model Retrained',
      description: `${modelName} has been successfully retrained with the latest data.`,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField className="opacity-20" />
        </Suspense>
        
        <div className="absolute inset-0 bg-gradient-to-b from-chart-4/5 via-transparent to-transparent" />
        
        <div className="container relative z-10">
          <AnimatedSection>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chart-4/10 border border-chart-4/20 backdrop-blur-sm text-chart-4 text-sm font-medium mb-4"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            >
              <Cpu className="h-4 w-4" />
              Machine Learning
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
              Model{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-4 to-primary">
                Performance
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Compare ML models and their prediction metrics
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          {/* Best Model Highlight */}
          <AnimatedSection delay={0.1}>
            <GlassCard className="mb-8 border-primary/30" glow>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25"
                    animate={shouldReduceMotion ? undefined : { 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Trophy className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">Best Performing Model</h3>
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Random Forest achieves the highest accuracy at 94.2% with the lowest error rates.
                    </p>
                  </div>
                  <motion.div
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => handleRetrain('Random Forest')} 
                      disabled={isRetraining !== null}
                      className="bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25"
                    >
                      {isRetraining === 'Random Forest' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Retraining...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retrain Model
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Model Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {mockModels.map((model, index) => (
              <AnimatedSection key={model.name} delay={0.2 + index * 0.1}>
                <GlassCard 
                  className={cn(
                    'h-full',
                    model.is_best && 'ring-2 ring-primary/30'
                  )}
                  glow={model.is_best}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                          {model.name}
                          {model.is_best && (
                            <Trophy className="h-5 w-5 text-primary" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {model.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Accuracy */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                          </div>
                          <AnimatedCounter 
                            value={`${model.accuracy}%`}
                            className="text-xl font-bold text-foreground"
                            delay={0.3 + index * 0.1}
                          />
                        </div>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                          style={{ transformOrigin: 'left' }}
                        >
                          <Progress value={model.accuracy} className="h-2" />
                        </motion.div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 border border-border/30"
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-destructive" />
                            <span className="text-sm text-muted-foreground">RMSE</span>
                          </div>
                          <p className="text-xl font-bold text-foreground">{model.rmse}</p>
                        </motion.div>
                        <motion.div 
                          className="p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 border border-border/30"
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Gauge className="h-4 w-4 text-secondary" />
                            <span className="text-sm text-muted-foreground">MAE</span>
                          </div>
                          <p className="text-xl font-bold text-foreground">{model.mae}</p>
                        </motion.div>
                      </div>

                      {/* Retrain Button */}
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          className="w-full bg-background/50 backdrop-blur-sm border-border/50"
                          onClick={() => handleRetrain(model.name)}
                          disabled={isRetraining !== null}
                        >
                          {isRetraining === model.name ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Retraining...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retrain Model
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>

          {/* Metrics Legend */}
          <AnimatedSection delay={0.6}>
            <GlassCard className="mt-8" hover={false}>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Understanding the Metrics</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Accuracy (%)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The percentage of correct predictions. Higher is better.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-destructive/5 to-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-destructive" />
                      <h4 className="font-semibold text-foreground">RMSE</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Root Mean Squared Error - measures prediction error magnitude. Lower is better.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="h-5 w-5 text-secondary" />
                      <h4 className="font-semibold text-foreground">MAE</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mean Absolute Error - average prediction error in vehicle count. Lower is better.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
