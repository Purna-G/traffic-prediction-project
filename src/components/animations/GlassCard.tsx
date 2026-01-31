import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
}

export function GlassCard({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  delay = 0
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const baseClasses = cn(
    "relative overflow-hidden rounded-2xl",
    "bg-card/60 dark:bg-card/40",
    "backdrop-blur-xl backdrop-saturate-150",
    "border border-border/50",
    "shadow-lg",
    glow && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:via-transparent before:to-secondary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
    className
  );
  
  if (shouldReduceMotion) {
    return <div className={baseClasses}>{children}</div>;
  }
  
  return (
    <motion.div
      className={baseClasses}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -5,
        transition: { duration: 0.2 }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function GlassButton({ children, className = '', onClick, disabled }: GlassButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const baseClasses = cn(
    "relative px-6 py-3 rounded-xl font-medium",
    "bg-primary/90 text-primary-foreground",
    "backdrop-blur-sm",
    "border border-primary/20",
    "shadow-lg shadow-primary/20",
    "overflow-hidden",
    "transition-colors",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );
  
  if (shouldReduceMotion) {
    return (
      <button className={baseClasses} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }
  
  return (
    <motion.button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  amplitude?: number;
}

export function FloatingElement({ 
  children, 
  className = '', 
  delay = 0,
  amplitude = 10
}: FloatingElementProps) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      animate={{ 
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
