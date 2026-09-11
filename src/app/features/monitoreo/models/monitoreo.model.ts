export interface WeatherCurrent {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  observedAt: string;
}

export interface WeatherForecast {
  location: string;
  date: string;
  minTemperature: number;
  maxTemperature: number;
  condition: string;
  precipitationProbability: number;
}

export interface EarthquakeEvent {
  id: string;
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  location: string;
  occurredAt: string;
}

export interface SeismicRiskPrediction {
  zone: string;
  riskLevel: 'bajo' | 'moderado' | 'alto' | 'critico';
  probability: number;
  validUntil: string;
  source: string;
}
