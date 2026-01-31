import { Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/animations/GlassCard';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { ParallaxSection } from '@/components/animations/ParallaxSection';
import { 
  Car, 
  Code, 
  Database, 
  Brain, 
  Cloud, 
  Building2,
  GraduationCap,
  Users,
  Sparkles,
  Cpu,
  Leaf
} from 'lucide-react';

const ParticleField = lazy(() => import('@/components/3d/ParticleField').then(m => ({ default: m.ParticleField })));
const FloatingCar = lazy(() => import('@/components/3d/FloatingCar').then(m => ({ default: m.FloatingCar })));

const techStack = [
  { name: 'React', category: 'Frontend', color: 'from-primary/20 to-primary/10' },
  { name: 'TypeScript', category: 'Frontend', color: 'from-primary/20 to-primary/10' },
  { name: 'Tailwind CSS', category: 'Frontend', color: 'from-primary/20 to-primary/10' },
  { name: 'Recharts', category: 'Visualization', color: 'from-chart-1/20 to-chart-1/10' },
  { name: 'Flask', category: 'Backend', color: 'from-secondary/20 to-secondary/10' },
  { name: 'Python', category: 'Backend', color: 'from-secondary/20 to-secondary/10' },
  { name: 'scikit-learn', category: 'ML', color: 'from-chart-4/20 to-chart-4/10' },
  { name: 'XGBoost', category: 'ML', color: 'from-chart-4/20 to-chart-4/10' },
  { name: 'Pandas', category: 'Data', color: 'from-chart-2/20 to-chart-2/10' },
  { name: 'NumPy', category: 'Data', color: 'from-chart-2/20 to-chart-2/10' },
];

const benefits = [
  {
    icon: Car,
    title: 'Reduced Congestion',
    description: 'Proactive traffic management based on accurate predictions reduces congestion and delays.',
  },
  {
    icon: Leaf,
    title: 'Environmental Impact',
    description: 'Optimized traffic flow leads to reduced emissions and better air quality.',
  },
  {
    icon: Building2,
    title: 'Urban Planning',
    description: 'Data-driven insights support infrastructure decisions and city development.',
  },
  {
    icon: Users,
    title: 'Improved Safety',
    description: 'Anticipating high-traffic periods enables better resource allocation for safety.',
  },
];

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField className="opacity-20" />
        </Suspense>
        
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm text-primary text-sm font-medium mb-6"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4" />
              About the Project
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Traffic<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Telligence</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TrafficTelligence is an intelligent traffic volume prediction system that leverages 
              machine learning to forecast traffic patterns based on weather conditions, time factors, 
              and historical data. Built for smart city applications and urban planning research.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          {/* Project Purpose */}
          <AnimatedSection delay={0.1}>
            <GlassCard className="mb-12" glow>
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <motion.div 
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25"
                    animate={shouldReduceMotion ? undefined : { rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <GraduationCap className="h-7 w-7 text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Project Purpose</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      This project was developed to demonstrate the application of machine learning in 
                      urban traffic management. By analyzing multiple factors including weather conditions, 
                      time of day, day of week, and special events like holidays, our system provides 
                      accurate traffic volume predictions that can help city planners, commuters, and 
                      transportation authorities make informed decisions.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Technology Stack */}
          <AnimatedSection delay={0.2}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/70 shadow-lg shadow-secondary/25">
                  <Code className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Technology Stack</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.1, y: -2 }}
                  >
                    <Badge 
                      variant="outline" 
                      className={`px-5 py-2.5 text-base font-medium bg-gradient-to-br ${tech.color} border-border/50 backdrop-blur-sm`}
                    >
                      {tech.name}
                      <span className="ml-2 text-xs text-muted-foreground">({tech.category})</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ML Models with 3D Car */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12 items-center">
            <AnimatedSection delay={0.3}>
              <GlassCard glow>
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4 to-chart-4/70 shadow-lg shadow-chart-4/25">
                      <Brain className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Machine Learning Models</h2>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our prediction system employs multiple machine learning algorithms to ensure 
                    accuracy and reliability:
                  </p>
                  
                  <ul className="space-y-4">
                    {[
                      { name: 'Random Forest', desc: 'Ensemble method achieving 94.2% accuracy', icon: Cpu },
                      { name: 'XGBoost', desc: 'Gradient boosting for high-performance predictions', icon: Cpu },
                      { name: 'Neural Networks', desc: 'Deep learning for complex pattern recognition', icon: Brain },
                      { name: 'Linear Regression', desc: 'Baseline model for comparison', icon: Cpu },
                    ].map((item, index) => (
                      <motion.li 
                        key={item.name}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-transparent border border-border/30"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={shouldReduceMotion ? undefined : { x: 5 }}
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <span className="text-muted-foreground text-sm ml-2">— {item.desc}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </AnimatedSection>
            
            <ParallaxSection speed={0.2} className="hidden lg:block">
              <div className="h-[400px] relative">
                <Suspense fallback={<LoadingFallback />}>
                  <FloatingCar />
                </Suspense>
              </div>
            </ParallaxSection>
          </div>

          {/* Smart City Benefits */}
          <AnimatedSection delay={0.4}>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Smart City Benefits</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <GlassCard key={benefit.title} delay={index * 0.1} glow>
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div 
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50"
                            whileHover={shouldReduceMotion ? undefined : { rotate: 10, scale: 1.1 }}
                          >
                            <Icon className="h-6 w-6 text-foreground" />
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-foreground text-lg mb-2">{benefit.title}</h3>
                            <p className="text-muted-foreground">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Data Sources */}
          <AnimatedSection delay={0.5}>
            <GlassCard className="mb-12">
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2/30 to-chart-2/10">
                    <Database className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Data Sources</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      The system is trained on comprehensive datasets including historical traffic counts, 
                      weather data from meteorological services, calendar information for holidays and 
                      events, and time-series data for temporal pattern analysis. This multi-source 
                      approach ensures robust and reliable predictions across various conditions.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>

          {/* Developer Info */}
          <AnimatedSection delay={0.6}>
            <GlassCard glow>
              <div className="p-8 md:p-10 text-center">
                <motion.div
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary mb-6 shadow-lg shadow-primary/25"
                  animate={shouldReduceMotion ? undefined : { 
                    boxShadow: [
                      '0 10px 25px -5px rgba(var(--primary), 0.25)',
                      '0 10px 40px -5px rgba(var(--primary), 0.4)',
                      '0 10px 25px -5px rgba(var(--primary), 0.25)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Cloud className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">About the Developer</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
                  This project was developed as part of academic research in machine learning and 
                  urban informatics. It demonstrates the practical application of data science 
                  in solving real-world transportation challenges.
                </p>
                
                <div className="flex justify-center gap-3 flex-wrap">
                  {['Machine Learning', 'Full-Stack Development', 'Data Science', 'Urban Informatics'].map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                    >
                      <Badge variant="outline" className="px-4 py-2 text-sm bg-gradient-to-r from-primary/10 to-secondary/10 border-border/50">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
