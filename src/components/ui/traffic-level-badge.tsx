import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrafficLevelBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  className?: string;
}

const levelStyles = {
  Low: 'bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30',
  Medium: 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30',
  High: 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30',
};

export function TrafficLevelBadge({ level, className }: TrafficLevelBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(levelStyles[level], 'font-semibold', className)}
    >
      {level} Traffic
    </Badge>
  );
}
