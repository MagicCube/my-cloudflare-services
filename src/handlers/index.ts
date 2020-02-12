import config from '../config';
import { fetchStock, fetchWeatherForecast, fetchWeatherNow } from '../services';

export async function handleIndex(request: Request): Promise<Response> {
  const [stock, weatherNow, weatherForecast] = await Promise.all([
    fetchStock(config.stock.symbol),
    fetchWeatherNow(config.weather.locationCode),
    fetchWeatherForecast(config.weather.locationCode)
  ]);
  return new Response(
    JSON.stringify({
      stock,
      weather: [weatherNow, ...weatherForecast]
    }),
    { status: 200 }
  );
}

export async function handleStock(request: Request): Promise<Response> {
  const result = await fetchStock(config.stock.symbol);
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function handleWeatherForecast(
  request: Request
): Promise<Response> {
  const result = await fetchWeatherForecast(config.weather.locationCode);
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function handleWeatherNow(request: Request): Promise<Response> {
  const result = await fetchWeatherNow(config.weather.locationCode);
  return new Response(JSON.stringify(result), { status: 200 });
}
