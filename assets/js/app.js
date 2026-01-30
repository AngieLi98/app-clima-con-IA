import { CONFIG } from "./config.js";

// App.js - Lógica principal para buscar ciudad y mostrar temperatura
const $ = (sel) => document.querySelector(sel);

function getWeatherIcon(code) {
  const icons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️',
    80: '🌦️', 81: '🌦️', 82: '🌧️',
    95: '⛈️'
  };

  return icons[code] || '❓';
}

const UI = {
  form: $('#search-form'),
  input: $('#city'),
  status: $('#status'),
  result: $('#result'),
  place: $('#place'),
  temp: $('#temp'),
  icon: $('#weather-icon'),
  details: $('#details'),

  setStatus(msg, type = '') {
    this.status.textContent = msg || '';
    this.status.className = `status ${type}`.trim();
  },

  setLoading(isLoading) {
    const btn = this.form.querySelector('button[type="submit"]');
    btn.disabled = isLoading;
    btn.textContent = isLoading ? 'Buscando…' : 'Buscar';
  },

  showResult({
    name,
    country,
    temperature,
    observationTime,
    humidity,
    windspeed,
    precipitation,
    weathercode
  }) {
    this.place.textContent = `${name}${country ? ', ' + country : ''}`;
    this.temp.textContent = Math.round(temperature);
    this.icon.textContent = getWeatherIcon(weathercode);

    const fmt = (v, suf) =>
      v === null || v === undefined ? 'N/A' : `${v}${suf}`;

    this.details.textContent =
      `Actualizado: ${observationTime} • ` +
      `Humedad: ${fmt(humidity, '%')} • ` +
      `Viento: ${fmt(windspeed, ' km/h')} • ` +
      `Precipitación: ${fmt(precipitation, ' mm')}`;

    this.result.hidden = false;
  },

  hideResult() {
    this.result.hidden = true;
  }
};

// --------------------------------------------------------------
// Errores tipados simples para mensajes consistentes en la UI
// --------------------------------------------------------------
class AppError extends Error { constructor(message, code = 'APP_ERROR') { super(message); this.name = 'AppError'; this.code = code; } }
class ValidationError extends AppError { constructor(message, code = 'VALIDATION') { super(message, code); this.name = 'ValidationError'; } }
class NotFoundError extends AppError { constructor(message, code = 'NOT_FOUND') { super(message, code); this.name = 'NotFoundError'; } }
class NetworkError extends AppError { constructor(message, code = 'NETWORK') { super(message, code); this.name = 'NetworkError'; } }

// Helpers mínimos de validación para principiantes
function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }
function isFiniteNumber(v) { return Number.isFinite(v); }

async function getCoordinates(city) {
  // Validación de entrada para mayor claridad
  const name = (city ?? '').trim();
  if (!isNonEmptyString(name)) {
    throw new ValidationError('Debes ingresar el nombre de una ciudad.');
  }

  //Simulación si manejara una clave API segura
   const API_KEY = CONFIG.WEATHER_API_KEY;

  // Geocoding de Open-Meteo: https://open-meteo.com/en/docs/geocoding-api
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '1'); // solo el primer resultado
  url.searchParams.set('language', 'es');
  url.searchParams.set('format', 'json');

  let res;
  try {
    res = await fetch(url.toString());
  } catch (e) {
    // Error de red/Conectividad
    throw new NetworkError('No se pudo conectar para obtener coordenadas.');
  }

  if (!res.ok) {
    // Contexto con status para depurar (no mostrado al usuario final)
    throw new AppError(`No se pudo obtener coordenadas (HTTP ${res.status}).`);
  }

  const data = await res.json().catch(() => ({}));
  const results = Array.isArray(data.results) ? data.results : [];
  if (results.length === 0) {
    throw new NotFoundError(`No se encontró la ciudad: ${name}.`);
  }

  const r = results[0];
  if (typeof r.latitude !== 'number' || typeof r.longitude !== 'number') {
    throw new AppError('La respuesta de geocodificación no tiene coordenadas válidas.');
  }
  return { lat: r.latitude, lon: r.longitude, name: r.name, country: r.country_code };
}

async function getCurrentTemperature(lat, lon) {
  if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) {
    throw new ValidationError('Latitud/longitud inválidas.');
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation',
      'wind_speed_10m',
      'weathercode'
    ].join(',')
  );
  url.searchParams.set('temperature_unit', 'celsius');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('timezone', 'auto');

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new NetworkError('No se pudo conectar para obtener el clima.');
  }

  if (!res.ok) {
    throw new AppError(`Error HTTP ${res.status}`);
  }

  const data = await res.json();
  const c = data.current;

  return {
    temperature: c.temperature_2m,
    observationTime: c.time,
    humidity: c.relative_humidity_2m,
    windspeed: c.wind_speed_10m,
    precipitation: c.precipitation,
    weathercode: c.weathercode
  };
}

if (UI.form) {
  UI.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = UI.input.value.trim();
    if (!raw) {
      UI.setStatus('Ingresa el nombre de una ciudad.', 'error');
      UI.hideResult();
      return;
    }

    try {
      UI.setStatus('Buscando…');
      UI.setLoading(true);
      UI.hideResult();

      const { lat, lon, name, country } = await getCoordinates(raw);
      const weather = await getCurrentTemperature(lat, lon);

      UI.showResult({ name, country, ...weather });
      UI.setStatus('Completado', 'success');
    } catch (err) {
      console.error(err);
      // Mensajes de error contextualizados y consistentes
      if (err instanceof ValidationError || err instanceof NotFoundError || err instanceof NetworkError || err instanceof AppError) {
        UI.setStatus(err.message, 'error');
      } else {
        UI.setStatus('Ocurrió un error inesperado', 'error');
      }
      UI.hideResult();
    } finally {
      UI.setLoading(false);
    }
  });
}

// Exportar funciones para pruebas en entorno Node (no afecta al navegador)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getCoordinates, getCurrentTemperature, UI };
}
