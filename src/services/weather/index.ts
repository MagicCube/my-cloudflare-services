import config from '../../config';

import { HE_WEATHER_CODES } from './constants';

export async function fetchWeatherForecast(locationCode: string) {
  let res;
  try {
    res = await fetch(
      `https://free-api.heweather.net/s6/weather/forecast?key=${config.weather.apiKey}&lang=en&location=${locationCode}`
    );
  } catch (e) {
    console.error(e);
    throw new Error('Fail to connect to free-api.heweather.net.');
  }
  if (res.status === 200) {
    const json = await res.json();
    const forecast = json.HeWeather6[0].daily_forecast.map(
      (raw: Record<string, any>) => ({
        date: raw.date,
        day: new Date(raw.date)
          .toUTCString()
          .substr(0, 3)
          .toUpperCase(),
        dayCond: raw.cond_txt_d,
        dayCondCode: translateWeatherCode(raw.cond_code_d),
        nightCond: raw.cond_txt_n,
        nightCondCode: translateWeatherCode(raw.cond_code_n),
        highTemp: parseFloat(raw.tmp_max),
        lowTemp: parseFloat(raw.tmp_min)
      })
    );
    return forecast;
  } else {
    throw new Error(
      `HTTP ${res.status}, fail to load from free-api.heweather.net.`
    );
  }
}

function translateWeatherCode(code: string) {
  const translated = HE_WEATHER_CODES[code] as string | undefined;
  return translated ? translated : 'M';
}
