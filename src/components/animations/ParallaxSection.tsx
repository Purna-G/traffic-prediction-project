import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export function ParallaxSection({ 
  children, 
  className = '', 
  speed = 0.5,
  direction = 'up'
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  
  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function ScaleOnScroll({ children, className = '' }: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  
  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }
  
  return (
    <motion.div 
      ref={ref} 
      className={className}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

interface RotateOnScrollProps {
  children: ReactNode;
  className?: string;
  range?: [number, number];
}

export function RotateOnScroll({ 
  children, 
  className = '',
  range = [-5, 5]
}: RotateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const rotate = useTransform(scrollYProgress, [0, 1], range);
  
  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }
  
  return (
    <motion.div 
      ref={ref} 
      className={className}
      style={{ rotate }}
    >
      {children}
    </motion.div>
  );
}
