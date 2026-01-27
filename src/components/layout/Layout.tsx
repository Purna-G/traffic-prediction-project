import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TrafficTelligence. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by Machine Learning • Built for Smart Cities
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
