import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Cloud, 
  Cpu,
  ArrowRight,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import heroImage from '@/assets/hero-traffic.jpg';

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

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
        </div>
        
        <div className="container relative z-10 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Cpu className="h-4 w-4" />
              ML-Powered Traffic Intelligence
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Predict Traffic Volume with{' '}
              <span className="text-primary">AI Precision</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Harness the power of machine learning to forecast traffic patterns based on weather, 
              time, and historical data. Make smarter urban planning decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/predict">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Predicting
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/analytics">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligent Traffic Forecasting
            </h2>
            <p className="text-lg text-muted-foreground">
              Our system combines multiple data sources and advanced algorithms to deliver 
              accurate traffic predictions for any scenario.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose TrafficTelligence?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Built for urban planners, researchers, and smart city initiatives, our platform 
                provides the insights needed to optimize traffic flow and reduce congestion.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Card className="bg-card border-border p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Prediction Accuracy</span>
                  <span className="text-2xl font-bold text-primary">94.2%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="text-2xl font-bold text-secondary">&lt;100ms</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Data Freshness</span>
                  <span className="text-2xl font-bold text-primary">Real-time</span>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link to="/predict">
                    Try It Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Predict Traffic?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start making data-driven decisions with our ML-powered traffic prediction system.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/predict">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
