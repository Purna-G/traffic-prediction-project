import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up',
  duration = 0.6
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 },
  };
  
  const offset = directionOffset[direction];
  
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }
  
  const words = text.split(' ');
  
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.4, 
            delay: delay + i * 0.05,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

interface AnimatedCounterProps {
  value: string;
  className?: string;
  delay?: number;
}

export function AnimatedCounter({ value, className = '', delay = 0 }: AnimatedCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <span className={className}>{value}</span>;
  }
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
    >
      {value}
    </motion.span>
  );
}
