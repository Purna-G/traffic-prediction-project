import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container relative py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} TrafficTelligence. All rights reserved.
            </motion.p>
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Powered by Machine Learning • Built for Smart Cities
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
}
