import { Suspense, lazy, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrafficLevelBadge } from '@/components/ui/traffic-level-badge';
import { GlassCard } from '@/components/animations/GlassCard';
import { AnimatedSection } from '@/components/animations/AnimatedSection';
import { Search, Download, ChevronLeft, ChevronRight, History as HistoryIcon, FileSpreadsheet, FileText } from 'lucide-react';

const ParticleField = lazy(() => import('@/components/3d/ParticleField').then(m => ({ default: m.ParticleField })));

// Mock history data
const historyData = [
  { id: '1', date: '2024-01-15', time: '08:00', weather: 'Clear', temp: 22, traffic: 3240, level: 'High' as const, confidence: 92 },
  { id: '2', date: '2024-01-15', time: '14:00', weather: 'Cloudy', temp: 25, traffic: 2180, level: 'Medium' as const, confidence: 88 },
  { id: '3', date: '2024-01-14', time: '09:00', weather: 'Rainy', temp: 18, traffic: 1890, level: 'Medium' as const, confidence: 85 },
  { id: '4', date: '2024-01-14', time: '17:30', weather: 'Clear', temp: 24, traffic: 3560, level: 'High' as const, confidence: 91 },
  { id: '5', date: '2024-01-13', time: '12:00', weather: 'Partly Cloudy', temp: 20, traffic: 2450, level: 'Medium' as const, confidence: 87 },
  { id: '6', date: '2024-01-13', time: '06:00', weather: 'Foggy', temp: 15, traffic: 1240, level: 'Low' as const, confidence: 83 },
  { id: '7', date: '2024-01-12', time: '08:30', weather: 'Clear', temp: 21, traffic: 3120, level: 'High' as const, confidence: 90 },
  { id: '8', date: '2024-01-12', time: '20:00', weather: 'Clear', temp: 19, traffic: 1680, level: 'Low' as const, confidence: 86 },
  { id: '9', date: '2024-01-11', time: '07:00', weather: 'Snowy', temp: -2, traffic: 980, level: 'Low' as const, confidence: 78 },
  { id: '10', date: '2024-01-11', time: '16:00', weather: 'Cloudy', temp: 3, traffic: 2340, level: 'Medium' as const, confidence: 84 },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const shouldReduceMotion = useReducedMotion();

  const filteredData = historyData.filter((item) => {
    const matchesSearch = 
      item.date.includes(searchQuery) ||
      item.weather.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || item.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = (format: 'csv' | 'pdf') => {
    // In production, implement actual export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField className="opacity-20" />
        </Suspense>
        
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-transparent" />
        
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <AnimatedSection>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm text-secondary text-sm font-medium mb-4"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              >
                <HistoryIcon className="h-4 w-4" />
                Past Predictions
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                Prediction{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                  History
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                View and export your past traffic predictions
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.1}>
              <div className="flex gap-3">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button variant="outline" onClick={() => handleExport('csv')} className="bg-background/50 backdrop-blur-sm border-border/50">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  <Button variant="outline" onClick={() => handleExport('pdf')} className="bg-background/50 backdrop-blur-sm border-border/50">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <AnimatedSection delay={0.2}>
            <GlassCard className="overflow-visible" hover={false}>
              <div className="p-6 border-b border-border/50">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                      <HistoryIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Past Predictions</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by date or weather..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full sm:w-64 bg-background/50 backdrop-blur-sm border-border/50"
                      />
                    </div>
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger className="w-full sm:w-40 bg-background/50 backdrop-blur-sm border-border/50">
                        <SelectValue placeholder="Filter by level" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background/30 backdrop-blur-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/40">
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Weather</TableHead>
                        <TableHead>Temp (°C)</TableHead>
                        <TableHead>Vehicles</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                          >
                            <TableCell className="font-medium">{item.date}</TableCell>
                            <TableCell>{item.time}</TableCell>
                            <TableCell>{item.weather}</TableCell>
                            <TableCell>{item.temp}</TableCell>
                            <TableCell className="font-semibold">{item.traffic.toLocaleString()}</TableCell>
                            <TableCell>
                              <TrafficLevelBadge level={item.level} />
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{item.confidence}%</span>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                            No predictions found matching your criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                      {filteredData.length} results
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="bg-background/50 backdrop-blur-sm border-border/50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <span className="text-sm text-muted-foreground px-3">
                        Page {currentPage} of {totalPages}
                      </span>
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="bg-background/50 backdrop-blur-sm border-border/50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
