import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { AnimatedSection, AnimatedCounter } from '@/components/animations/AnimatedSection';
import { GlassCard } from '@/components/animations/GlassCard';
import { ParallaxSection, ScaleOnScroll } from '@/components/animations/ParallaxSection';
import {
  TrendingUp,
  BarChart3,
  Clock,
  Cloud,
  Cpu,
  ArrowRight,
  Zap,
  Shield,
  Target,
  Sparkles
} from 'lucide-react';

// 3D components removed as per new design direction

const features = [
  {
    icon: Cloud,
    title: 'Weather-Aware Predictions',
    description: 'Our ML models factor in temperature, rainfall, snowfall, and weather conditions to deliver accurate traffic forecasts.',
  },
  {
    icon: Clock,
    title: 'Time-Based Analysis',
    description: 'Account for peak hours, holidays, and day-of-week patterns that significantly impact traffic flow.',
  },
  {
    icon: Cpu,
    title: 'Advanced ML Models',
    description: 'Powered by Random Forest, XGBoost, and regression algorithms for reliable predictions.',
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics',
    description: 'Visualize traffic patterns with interactive charts and historical trend analysis.',
  },
];

const stats = [
  { label: 'Predictions Made', value: '50K+' },
  { label: 'Model Accuracy', value: '94%' },
  { label: 'Data Points Analyzed', value: '2M+' },
  { label: 'Cities Supported', value: '12' },
];

const benefits = [
  {
    icon: Zap,
    title: 'Real-Time Predictions',
    description: 'Get instant traffic volume forecasts for any date, time, and weather condition.',
  },
  {
    icon: Shield,
    title: 'Reliable Results',
    description: 'Trained on extensive historical data for consistent and dependable predictions.',
  },
  {
    icon: Target,
    title: 'Smart City Ready',
    description: 'Designed for integration with urban planning and traffic management systems.',
  },
];

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Index() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Layout>
      {/* Hero Section with 3D Scene */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Minimalist Background */}
        <div className="absolute inset-0 z-0 bg-background" />

        <div className="container relative z-10 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <AnimatedSection delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 backdrop-blur-sm text-primary text-sm font-medium"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4" />
                ML-Powered Traffic Intelligence
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
                Predict Traffic Volume with{' '}
                <span className="text-primary italic">
                  AI Precision
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Harness the power of machine learning to forecast traffic patterns based on weather,
                time, and historical data. Make smarter urban planning decisions.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-none bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link to="/predict">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Start Predicting
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full bg-transparent border-input hover:bg-muted">
                    <Link to="/analytics">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      View Analytics
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-primary"
              animate={shouldReduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden bg-muted/30">

        <div className="container relative z-10">
          <GlassCard className="p-8" hover={false}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 0.1} direction="up">
                  <div className="text-center">
                    <AnimatedCounter
                      value={stat.value}
                      className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                      delay={index * 0.1}
                    />
                    <p className="text-sm md:text-base text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

        <div className="container relative z-10">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Intelligent Traffic{' '}
              <span className="text-primary">
                Forecasting
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our system combines multiple data sources and advanced algorithms to deliver
              accurate traffic predictions for any scenario.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  className="p-6"
                  glow
                  delay={index * 0.1}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-5">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section with 3D Car */}
      <section className="py-24 relative overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ParallaxSection speed={0.3}>
              <AnimatedSection>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Why Choose{' '}
                  <span className="text-primary">
                    TrafficTelligence?
                  </span>
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  Built for urban planners, researchers, and smart city initiatives, our platform
                  provides the insights needed to optimize traffic flow and reduce congestion.
                </p>
              </AnimatedSection>

              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <AnimatedSection key={benefit.title} delay={0.2 + index * 0.1} direction="left">
                      <GlassCard className="p-5 flex gap-5" hover>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">{benefit.title}</h4>
                          <p className="text-muted-foreground">{benefit.description}</p>
                        </div>
                      </GlassCard>
                    </AnimatedSection>
                  );
                })}
              </div>
            </ParallaxSection>

            <ScaleOnScroll className="hidden lg:block">
              <div className="relative h-[500px] flex items-center justify-center bg-muted/20 rounded-3xl">
                {/* Abstract Visual Representation */}
                <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-border flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border border-border/50 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary/5" />
                    </div>
                  </div>
                </div>

                {/* Stats overlay cards */}
                <motion.div
                  className="absolute top-8 right-0"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <GlassCard className="p-4 min-w-[180px]" hover={false}>
                    <p className="text-xs text-muted-foreground">Prediction Accuracy</p>
                    <p className="text-2xl font-bold text-primary">94.2%</p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  className="absolute bottom-20 left-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <GlassCard className="p-4 min-w-[160px]" hover={false}>
                    <p className="text-xs text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold text-secondary">&lt;100ms</p>
                  </GlassCard>
                </motion.div>

                <motion.div
                  className="absolute bottom-8 right-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <GlassCard className="p-4 min-w-[160px]" hover={false}>
                    <p className="text-xs text-muted-foreground">Data Freshness</p>
                    <p className="text-2xl font-bold text-primary">Real-time</p>
                  </GlassCard>
                </motion.div>
              </div>
            </ScaleOnScroll>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">

        <div className="container relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Predict Traffic?
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Start making data-driven decisions with our ML-powered traffic prediction system.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="inline-block"
            >
              <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6 rounded-xl shadow-xl">
                <Link to="/predict">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
