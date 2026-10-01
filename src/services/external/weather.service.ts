/** External API consumed from the Services layer for the Cartago campus dashboard. */
export type CampusWeather = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  description: string;
  observedAt: string;
};

const WEATHER_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

export async function getCampusWeather(signal?: AbortSignal): Promise<CampusWeather> {
  const url = new URL(WEATHER_ENDPOINT);
  url.search = new URLSearchParams({
    latitude: "9.8644",
    longitude: "-83.9194",
    current: "temperature_2m,apparent_temperature,weather_code",
    timezone: "America/Costa_Rica",
  }).toString();
  const response = await fetch(url, { ...(signal ? { signal } : {}), headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Servicio meteorológico no disponible (${response.status})`);
  const payload = await response.json() as { current?: { temperature_2m?: number; apparent_temperature?: number; weather_code?: number; time?: string } };
  const current = payload.current;
  if (!current || typeof current.temperature_2m !== "number" || typeof current.weather_code !== "number") {
    throw new Error("Respuesta meteorológica incompleta");
  }
  return {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature ?? current.temperature_2m,
    weatherCode: current.weather_code,
    description: weatherDescription(current.weather_code),
    observedAt: current.time ?? new Date().toISOString(),
  };
}

export function weatherDescription(code: number) {
  if (code === 0) return "Despejado";
  if ([1, 2, 3].includes(code)) return "Parcialmente nublado";
  if ([45, 48].includes(code)) return "Neblina";
  if (code >= 51 && code <= 67) return "Lluvia";
  if (code >= 80 && code <= 82) return "Aguaceros";
  if (code >= 95) return "Tormenta";
  return "Condiciones variables";
}
