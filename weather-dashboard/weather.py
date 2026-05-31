#!/usr/bin/env python3
"""
Weather Dashboard Backend
Python program to fetch weather data and provide API endpoints
Compatible with VS Code and all Python environments
"""

import requests
import json
import sys
import os
from datetime import datetime
from typing import Dict, List, Optional

class WeatherAPI:
    """Weather API Client for Open-Meteo"""
    
    def __init__(self):
        self.geocoding_url = "https://geocoding-api.open-meteo.com/v1/search"
        self.weather_url = "https://api.open-meteo.com/v1/forecast"
        self.timeout = 10
    
    def search_city(self, city_name: str, limit: int = 5) -> List[Dict]:
        """
        Search for cities by name
        
        Args:
            city_name: Name of the city to search
            limit: Maximum number of results to return
            
        Returns:
            List of city information dictionaries
        """
        try:
            params = {
                'name': city_name,
                'count': limit,
                'language': 'en',
                'format': 'json'
            }
            response = requests.get(
                self.geocoding_url,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            data = response.json()
            
            if 'results' not in data or not data['results']:
                return []
            
            cities = []
            for city in data['results']:
                cities.append({
                    'name': city.get('name', ''),
                    'country': city.get('country', ''),
                    'latitude': city.get('latitude'),
                    'longitude': city.get('longitude'),
                    'timezone': city.get('timezone', ''),
                    'population': city.get('population', 0)
                })
            
            return cities
            
        except requests.exceptions.ConnectionError:
            print("❌ ERROR: Cannot connect to internet. Please check your connection.", file=sys.stderr)
            return []
        except requests.exceptions.Timeout:
            print("❌ ERROR: Request timeout. Please try again.", file=sys.stderr)
            return []
        except Exception as e:
            print(f"❌ ERROR searching cities: {e}", file=sys.stderr)
            return []
    
    def get_weather(self, latitude: float, longitude: float, 
                   temperature_unit: str = 'celsius',
                   wind_speed_unit: str = 'ms') -> Optional[Dict]:
        """
        Get weather data for a location
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            temperature_unit: 'celsius' or 'fahrenheit'
            wind_speed_unit: 'ms' or 'mph'
            
        Returns:
            Dictionary containing weather data
        """
        try:
            params = {
                'latitude': latitude,
                'longitude': longitude,
                'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,visibility,cloud_cover,is_day',
                'hourly': 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
                'daily': 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset,uv_index_max',
                'timezone': 'auto',
                'temperature_unit': temperature_unit,
                'wind_speed_unit': wind_speed_unit
            }
            
            response = requests.get(
                self.weather_url,
                params=params,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.ConnectionError:
            print("❌ ERROR: Cannot connect to internet.", file=sys.stderr)
            return None
        except requests.exceptions.Timeout:
            print("❌ ERROR: Request timeout.", file=sys.stderr)
            return None
        except Exception as e:
            print(f"❌ ERROR fetching weather: {e}", file=sys.stderr)
            return None
    
    def get_city_weather(self, city_name: str, 
                        temperature_unit: str = 'celsius',
                        wind_speed_unit: str = 'ms') -> Optional[Dict]:
        """
        Get weather for a city by name
        
        Args:
            city_name: Name of the city
            temperature_unit: 'celsius' or 'fahrenheit'
            wind_speed_unit: 'ms' or 'mph'
            
        Returns:
            Dictionary containing city and weather data
        """
        # Search for city
        cities = self.search_city(city_name, limit=1)
        
        if not cities:
            print(f"❌ ERROR: City '{city_name}' not found", file=sys.stderr)
            return None
        
        city = cities[0]
        
        # Get weather
        weather_data = self.get_weather(
            city['latitude'],
            city['longitude'],
            temperature_unit,
            wind_speed_unit
        )
        
        if not weather_data:
            return None
        
        return {
            'city': city,
            'weather': weather_data
        }


class WeatherFormatter:
    """Format weather data for display"""
    
    WEATHER_DESCRIPTIONS = {
        0: 'Clear sky',
        1: 'Mostly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    }
    
    @staticmethod
    def get_description(code: int) -> str:
        """Get weather description from code"""
        return WeatherFormatter.WEATHER_DESCRIPTIONS.get(code, 'Unknown')
    
    @staticmethod
    def format_temperature(temp: float, unit: str = 'C') -> str:
        """Format temperature"""
        return f"{round(temp)}°{unit}"
    
    @staticmethod
    def format_current_weather(weather_data: Dict, city_info: Dict) -> str:
        """Format current weather for display"""
        try:
            current = weather_data['current']
            
            output = f"\n{'='*60}\n"
            output += f"📍 {city_info['name']}, {city_info['country']}\n"
            output += f"{'='*60}\n"
            output += f"📅 {datetime.now().strftime('%A, %B %d, %Y')}\n\n"
            
            output += f"🌡️  Temperature: {WeatherFormatter.format_temperature(current['temperature_2m'])}\n"
            output += f"🤔 Feels Like: {WeatherFormatter.format_temperature(current['apparent_temperature'])}\n"
            output += f"☁️  Condition: {WeatherFormatter.get_description(current['weather_code'])}\n\n"
            
            output += f"💧 Humidity: {current['relative_humidity_2m']}%\n"
            output += f"💨 Wind Speed: {round(current['wind_speed_10m'])} m/s\n"
            output += f"🌡️  Pressure: {round(current['pressure_msl'])} hPa\n"
            output += f"👁️  Visibility: {round(current['visibility']/1000, 1)} km\n"
            output += f"☁️  Cloud Cover: {current['cloud_cover']}%\n"
            
            return output
        except KeyError as e:
            print(f"❌ ERROR: Missing weather data field: {e}", file=sys.stderr)
            return ""
    
    @staticmethod
    def format_daily_forecast(weather_data: Dict) -> str:
        """Format 5-day forecast"""
        try:
            daily = weather_data['daily']
            
            output = f"\n{'='*60}\n"
            output += "5-DAY FORECAST\n"
            output += f"{'='*60}\n\n"
            
            for i in range(min(5, len(daily['time']))):
                date = datetime.fromisoformat(daily['time'][i])
                max_temp = round(daily['temperature_2m_max'][i])
                min_temp = round(daily['temperature_2m_min'][i])
                condition = WeatherFormatter.get_description(daily['weather_code'][i])
                rain = daily['precipitation_sum'][i] or 0
                
                output += f"📅 {date.strftime('%a, %b %d')}\n"
                output += f"   High: {max_temp}° | Low: {min_temp}°\n"
                output += f"   Condition: {condition}\n"
                
                if rain > 0:
                    output += f"   Rain: {rain:.1f}mm\n"
                
                output += "\n"
            
            return output
        except KeyError as e:
            print(f"❌ ERROR: Missing forecast data field: {e}", file=sys.stderr)
            return ""


def print_help():
    """Print help message"""
    print("""
🌤️  Weather Dashboard - Python CLI
================================

Usage:
    python weather.py <city_name>
    python weather.py "New York"
    python weather.py Delhi

Examples:
    python weather.py Tokyo
    python weather.py "Los Angeles"
    python weather.py Mumbai

Options:
    --help       Show this help message
    --json       Output as JSON only
    --save       Save data to file

Requirements:
    pip install requests

Data Source:
    Open-Meteo API (https://open-meteo.com)
    """)


def main():
    """Main function"""
    print("\n🌤️  Weather Dashboard - Python Backend\n")
    
    # Check arguments
    if len(sys.argv) < 2 or '--help' in sys.argv:
        print_help()
        return
    
    # Get city name
    city_name = ' '.join(sys.argv[1:])
    city_name = city_name.replace('--json', '').replace('--save', '').strip()
    
    if not city_name:
        print_help()
        return
    
    # Check for requests library
    try:
        import requests
    except ImportError:
        print("❌ ERROR: 'requests' library not installed!")
        print("\n💡 Solution: Run this command:")
        print("   pip install requests\n")
        sys.exit(1)
    
    print(f"🔍 Searching for: {city_name}...")
    
    # Initialize API
    weather_api = WeatherAPI()
    formatter = WeatherFormatter()
    
    # Get weather data
    result = weather_api.get_city_weather(city_name)
    
    if result:
        city_info = result['city']
        weather_data = result['weather']
        
        # Display current weather
        print(formatter.format_current_weather(weather_data, city_info))
        
        # Display forecast
        print(formatter.format_daily_forecast(weather_data))
        
        # Save to JSON if requested
        if '--save' in sys.argv:
            try:
                output_file = f"weather_{city_info['name'].lower().replace(' ', '_')}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                print(f"✅ Data saved to {output_file}\n")
            except IOError as e:
                print(f"❌ ERROR: Could not save file: {e}\n")
        
        # Output JSON if requested
        if '--json' in sys.argv:
            print("\n" + "="*60)
            print("JSON OUTPUT:")
            print("="*60)
            print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"\n❌ Failed to fetch weather for '{city_name}'")
        print("💡 Suggestions:")
        print("   - Check spelling of city name")
        print("   - Try full city name with country")
        print("   - Make sure you have internet connection")
        print("   - Check if Open-Meteo API is accessible\n")
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Program interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected ERROR: {e}")
        print("Please report this issue or check your setup\n")
        sys.exit(1)
