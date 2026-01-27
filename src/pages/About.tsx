import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Code, 
  Database, 
  Brain, 
  Cloud, 
  Building2,
  GraduationCap,
  Users,
  Sparkles
} from 'lucide-react';

const techStack = [
  { name: 'React', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Recharts', category: 'Visualization' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'scikit-learn', category: 'ML' },
  { name: 'XGBoost', category: 'ML' },
  { name: 'Pandas', category: 'Data' },
  { name: 'NumPy', category: 'Data' },
];

const benefits = [
  {
    icon: Car,
    title: 'Reduced Congestion',
    description: 'Proactive traffic management based on accurate predictions reduces congestion and delays.',
  },
  {
    icon: Cloud,
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

export default function About() {
  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            About the Project
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            TrafficTelligence
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TrafficTelligence is an intelligent traffic volume prediction system that leverages 
            machine learning to forecast traffic patterns based on weather conditions, time factors, 
            and historical data. Built for smart city applications and urban planning research.
          </p>
        </div>

        {/* Project Purpose */}
        <Card className="mb-12 border-border">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Project Purpose</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This project was developed to demonstrate the application of machine learning in 
                  urban traffic management. By analyzing multiple factors including weather conditions, 
                  time of day, day of week, and special events like holidays, our system provides 
                  accurate traffic volume predictions that can help city planners, commuters, and 
                  transportation authorities make informed decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Code className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Technology Stack</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <Badge 
                key={tech.name} 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium"
              >
                {tech.name}
                <span className="ml-2 text-xs text-muted-foreground">({tech.category})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* ML Models */}
        <Card className="mb-12 border-border">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Machine Learning Models</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our prediction system employs multiple machine learning algorithms to ensure 
                  accuracy and reliability:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span><strong className="text-foreground">Random Forest:</strong> Ensemble method achieving 94.2% accuracy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span><strong className="text-foreground">XGBoost:</strong> Gradient boosting for high-performance predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span><strong className="text-foreground">Neural Networks:</strong> Deep learning for complex pattern recognition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span><strong className="text-foreground">Linear Regression:</strong> Baseline model for comparison</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Smart City Benefits */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Smart City Benefits</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card key={benefit.title} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Data Sources */}
        <Card className="mb-12 border-border">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Database className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Data Sources</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The system is trained on comprehensive datasets including historical traffic counts, 
                  weather data from meteorological services, calendar information for holidays and 
                  events, and time-series data for temporal pattern analysis. This multi-source 
                  approach ensures robust and reliable predictions across various conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Info */}
        <Card className="border-border bg-card">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">About the Developer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              This project was developed as part of academic research in machine learning and 
              urban informatics. It demonstrates the practical application of data science 
              in solving real-world transportation challenges.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="px-4 py-2">Machine Learning</Badge>
              <Badge variant="outline" className="px-4 py-2">Full-Stack Development</Badge>
              <Badge variant="outline" className="px-4 py-2">Data Science</Badge>
              <Badge variant="outline" className="px-4 py-2">Urban Informatics</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
