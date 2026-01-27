import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Trophy, RefreshCw, Loader2, TrendingUp, Target, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="container py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Model Performance
            </h1>
            <p className="text-lg text-muted-foreground">
              Compare ML models and their prediction metrics
            </p>
          </div>
        </div>

        {/* Best Model Highlight */}
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                <Trophy className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground">Best Performing Model</h3>
                  <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                </div>
                <p className="text-muted-foreground">
                  Random Forest achieves the highest accuracy at 94.2% with the lowest error rates.
                </p>
              </div>
              <Button onClick={() => handleRetrain('Random Forest')} disabled={isRetraining !== null}>
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
            </div>
          </CardContent>
        </Card>

        {/* Model Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockModels.map((model) => (
            <Card 
              key={model.name} 
              className={cn(
                'border-border transition-all hover:shadow-lg',
                model.is_best && 'ring-2 ring-primary/20'
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {model.name}
                      {model.is_best && (
                        <Trophy className="h-5 w-5 text-primary" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {model.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Accuracy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{model.accuracy}%</span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">RMSE</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{model.rmse}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">MAE</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{model.mae}</p>
                  </div>
                </div>

                {/* Retrain Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Metrics Legend */}
        <Card className="mt-8 border-border">
          <CardHeader>
            <CardTitle className="text-lg">Understanding the Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Accuracy (%)</h4>
                <p className="text-sm text-muted-foreground">
                  The percentage of correct predictions. Higher is better.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">RMSE</h4>
                <p className="text-sm text-muted-foreground">
                  Root Mean Squared Error - measures prediction error magnitude. Lower is better.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">MAE</h4>
                <p className="text-sm text-muted-foreground">
                  Mean Absolute Error - average prediction error in vehicle count. Lower is better.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
