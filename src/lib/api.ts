// API configuration and utility functions
// API configuration and utility functions
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PredictionInput {
  from_loc: string;
  to_loc: string;
  date: string;
  time: string;
  // Optional for backward compatibility if needed, but mainly we use the above
  is_peak_hour?: boolean;
  is_holiday?: boolean;
}

export interface PredictionResult {
  vehicle_count: number;
  traffic_level: 'Low' | 'Medium' | 'High';
  distance_km: number;
  estimated_duration_min: number;
  weather_condition: string;
  temperature: number;
  route_from: string;
  route_to: string;
  confidence?: number; // Backend might not return this yet, optional
}

export interface HistoryRecord {
  id: string;
  date: string;
  inputs: PredictionInput;
  prediction: PredictionResult;
  created_at: string;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  rmse: number;
  mae: number;
  is_best: boolean;
  description?: string;
}

export interface AnalyticsData {
  daily: { date: string; traffic: number }[];
  weekday: { day: string; traffic: number }[];
  seasonal: { season: string; traffic: number }[];
  monthly?: { month: string; traffic: number }[];
}

// API Functions
export async function predictTraffic(input: PredictionInput): Promise<PredictionResult> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Prediction failed');
  }

  return response.json();
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const response = await fetch(`${API_BASE_URL}/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

export async function getModels(): Promise<ModelMetrics[]> {
  const response = await fetch(`${API_BASE_URL}/models`);
  if (!response.ok) throw new Error('Failed to fetch models');
  return response.json();
}



export async function retrainModel(modelName: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/retrain`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: modelName }),
  });

  if (!response.ok) {
    throw new Error('Retraining failed');
  }

  return response.json();
}

// Weather conditions for dropdown
export const WEATHER_CONDITIONS = [
  'Clear',
  'Cloudy',
  'Partly Cloudy',
  'Rainy',
  'Heavy Rain',
  'Snowy',
  'Foggy',
  'Stormy',
] as const;

export type WeatherCondition = typeof WEATHER_CONDITIONS[number];
