import config from '../config';
import { fetchStock, fetchWeatherForecast } from '../services';

export async function handleIndex(request: Request): Promise<Response> {
  const [stock, weather] = await Promise.all([
    fetchStock(config.stock.symbol),
    fetchWeatherForecast(config.weather.locationCode)
  ]);
  return new Response(
    JSON.stringify({
      stock,
      weather
    }),
    { status: 200 }
  );
}
