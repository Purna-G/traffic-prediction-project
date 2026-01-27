import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <div className="container py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Prediction History
            </h1>
            <p className="text-lg text-muted-foreground">
              View and export your past traffic predictions
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <CardTitle>Past Predictions</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by date or weather..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
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
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.date}</TableCell>
                        <TableCell>{item.time}</TableCell>
                        <TableCell>{item.weather}</TableCell>
                        <TableCell>{item.temp}</TableCell>
                        <TableCell>{item.traffic.toLocaleString()}</TableCell>
                        <TableCell>
                          <TrafficLevelBadge level={item.level} />
                        </TableCell>
                        <TableCell>{item.confidence}%</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No predictions found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                  {filteredData.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
