import type { ReactNode } from 'react'
import type { PlaceWeather } from '../types'

function WeatherIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="place-weather-icon" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      {children}
    </svg>
  )
}

function SunIcon() {
  return (
    <WeatherIcon>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <path
        d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </WeatherIcon>
  )
}

function MoonIcon() {
  return (
    <WeatherIcon>
      <path
        d="M11.5 3.2a5.5 5.5 0 1 0 1.3 9.8 4.5 4.5 0 1 1 0-9.8z"
        fill="currentColor"
      />
    </WeatherIcon>
  )
}

function WindIcon() {
  return (
    <WeatherIcon>
      <path
        d="M2.5 5.5h8.5a2 2 0 0 0 0-4H9M2.5 10.5h10a2.5 2.5 0 1 1 0 5h-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </WeatherIcon>
  )
}

type PlaceWeatherLabelProps = {
  weather: PlaceWeather
}

export function PlaceWeatherLabel({ weather }: PlaceWeatherLabelProps) {
  const high = Math.round(weather.highF)
  const low = Math.round(weather.lowF)
  const wind = Math.round(weather.windMph)

  return (
    <span
      className="place-weather"
      aria-label={`High ${high}°, low ${low}°, wind ${wind} miles per hour`}
    >
      <span className="place-weather-part">
        <SunIcon />
        {high}°
      </span>
      <span className="place-weather-part">
        <MoonIcon />
        {low}°
      </span>
      <span className="place-weather-part">
        <WindIcon />
        {wind}
      </span>
    </span>
  )
}
