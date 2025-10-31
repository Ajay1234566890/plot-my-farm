// Weather Service - OpenWeather API Integration
// Handles weather data fetching, caching, and error management

import AsyncStorage from '@react-native-async-storage/async-storage';

// OpenWeather API Configuration
const OPENWEATHER_API_KEY = '7fd7f8c9a3772a10d65a33e2c270d9e0';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Weather Data Types
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  sunrise: number;
  sunset: number;
  icon: string;
  timestamp: number;
}

export interface HourlyForecast {
  time: number;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface DailyForecast {
  date: number;
  day: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  };
}

export interface WeatherError {
  code: string;
  message: string;
  details?: any;
}

// Weather Service Class
class WeatherService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  /**
   * Get current weather data by coordinates
   */
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const cacheKey = `current_${lat}_${lon}`;
    
    // Check cache first
    const cached = await this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const weatherData: CurrentWeather = {
        location: `${data.name}, ${data.sys.country}`,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg || 0,
        pressure: data.main.pressure,
        visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        icon: data.weather[0].icon,
        timestamp: Date.now(),
      };

      // Cache the data
      await this.setCachedData(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw this.createWeatherError('FETCH_CURRENT_FAILED', 'Failed to fetch current weather data', error);
    }
  }

  /**
   * Get 5-day weather forecast
   */
  async getForecast(lat: number, lon: number): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
    const cacheKey = `forecast_${lat}_${lon}`;
    
    // Check cache first
    const cached = await this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const url = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process hourly forecast (next 24 hours)
      const hourly: HourlyForecast[] = data.list.slice(0, 8).map((item: any) => ({
        time: item.dt,
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
        precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
      }));

      // Process daily forecast (group by day)
      const dailyMap = new Map<string, any[]>();
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyMap.has(dayKey)) {
          dailyMap.set(dayKey, []);
        }
        dailyMap.get(dayKey)!.push(item);
      });

      const daily: DailyForecast[] = Array.from(dailyMap.entries()).slice(0, 5).map(([dayKey, items]) => {
        const temps = items.map(item => item.main.temp);
        const conditions = items.map(item => item.weather[0]);
        const mostCommonCondition = this.getMostCommonCondition(conditions);
        
        return {
          date: items[0].dt,
          day: this.formatDayName(new Date(dayKey)),
          highTemp: Math.round(Math.max(...temps)),
          lowTemp: Math.round(Math.min(...temps)),
          condition: mostCommonCondition.main,
          description: mostCommonCondition.description,
          icon: mostCommonCondition.icon,
          humidity: Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length),
          windSpeed: Math.round(items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length * 3.6),
          precipitation: items.reduce((sum, item) => sum + (item.rain?.['3h'] || item.snow?.['3h'] || 0), 0),
        };
      });

      const forecastData = { hourly, daily };
      
      // Cache the data
      await this.setCachedData(cacheKey, forecastData);
      
      return forecastData;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw this.createWeatherError('FETCH_FORECAST_FAILED', 'Failed to fetch weather forecast', error);
    }
  }

  /**
   * Get complete weather data (current + forecast)
   */
  async getCompleteWeatherData(lat: number, lon: number, locationName?: string): Promise<WeatherData> {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getForecast(lat, lon),
      ]);

      return {
        current,
        hourly: forecast.hourly,
        daily: forecast.daily,
        location: {
          name: locationName || current.location,
          country: current.location.split(', ')[1] || '',
          lat,
          lon,
        },
      };
    } catch (error) {
      console.error('Error fetching complete weather data:', error);
      throw this.createWeatherError('FETCH_COMPLETE_FAILED', 'Failed to fetch complete weather data', error);
    }
  }

  /**
   * Get UV Index data (requires separate API call)
   */
  async getUVIndex(lat: number, lon: number): Promise<number> {
    try {
      const url = `${OPENWEATHER_BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`UV Index API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return Math.round(data.value);
    } catch (error) {
      console.error('Error fetching UV index:', error);
      return 0; // Return 0 if UV data is not available
    }
  }

  /**
   * Cache management
   */
  private async getCachedData(key: string): Promise<any | null> {
    try {
      const cached = await AsyncStorage.getItem(`weather_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
        // Remove expired cache
        await AsyncStorage.removeItem(`weather_${key}`);
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  private async setCachedData(key: string, data: any): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`weather_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  /**
   * Utility methods
   */
  private getMostCommonCondition(conditions: any[]): any {
    const conditionCounts = conditions.reduce((acc, condition) => {
      acc[condition.main] = (acc[condition.main] || 0) + 1;
      return acc;
    }, {});

    const mostCommon = Object.keys(conditionCounts).reduce((a, b) => 
      conditionCounts[a] > conditionCounts[b] ? a : b
    );

    return conditions.find(c => c.main === mostCommon);
  }

  private formatDayName(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  }

  private createWeatherError(code: string, message: string, details?: any): WeatherError {
    return {
      code,
      message,
      details,
    };
  }

  /**
   * Clear all weather cache
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const weatherKeys = keys.filter(key => key.startsWith('weather_'));
      await AsyncStorage.multiRemove(weatherKeys);
    } catch (error) {
      console.error('Error clearing weather cache:', error);
    }
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
export default weatherService;
