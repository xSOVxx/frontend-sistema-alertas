import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../api/api-endpoints';
import { EarthquakeEvent, SeismicRiskPrediction, WeatherCurrent, WeatherForecast } from '../../models/monitoring.models';

@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private readonly http = inject(HttpClient);

  getCurrentWeather(latitude: number, longitude: number): Observable<WeatherCurrent> {
    const params = new HttpParams().set('latitude', latitude).set('longitude', longitude);
    return this.http.get<WeatherCurrent>(this.url(environment.services.weather, API_ENDPOINTS.weather.current), { params });
  }

  getForecast(latitude: number, longitude: number): Observable<WeatherForecast[]> {
    const params = new HttpParams().set('latitude', latitude).set('longitude', longitude);
    return this.http.get<WeatherForecast[]>(this.url(environment.services.weather, API_ENDPOINTS.weather.forecast), { params });
  }

  getRecentEarthquakes(): Observable<EarthquakeEvent[]> {
    return this.http.get<EarthquakeEvent[]>(this.url(environment.services.seismic, API_ENDPOINTS.seismic.recent));
  }

  getSeismicRisk(zone: string): Observable<SeismicRiskPrediction> {
    const params = new HttpParams().set('zone', zone);
    return this.http.get<SeismicRiskPrediction>(this.url(environment.services.seismic, API_ENDPOINTS.seismic.riskPrediction), { params });
  }

  private url(baseUrl: string, endpoint: string): string {
    return `${baseUrl}${endpoint}`;
  }
}
