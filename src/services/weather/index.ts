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
        day: getDayName(new Date(raw.date)),
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

export async function fetchWeatherNow(locationCode: string) {
  let res;
  try {
    res = await fetch(
      `https://free-api.heweather.net/s6/weather/now?key=${config.weather.apiKey}&lang=en&location=${locationCode}`
    );
  } catch (e) {
    console.error(e);
    throw new Error('Fail to connect to free-api.heweather.net.');
  }
  if (res.status === 200) {
    const json = await res.json();
    const raw = json.HeWeather6[0].now;
    const forecast = {
      date: json.HeWeather6[0].update.loc,
      day: getDayName(new Date(json.HeWeather6[0].update.loc)),
      dayCond: raw.cond_txt,
      dayCondCode: translateWeatherCode(raw.cond_code),
      nightCond: raw.cond_txt,
      nightCondCode: translateWeatherCode(raw.cond_code),
      highTemp: parseFloat(raw.tmp),
      lowTemp: parseFloat(raw.tmp)
    };
    return forecast;
  } else {
    throw new Error(
      `HTTP ${res.status}, fail to load from free-api.heweather.net.`
    );
  }
}

function getDayName(date: Date) {
  switch (date.getDay()) {
    case 0:
      return 'SUN';
    case 1:
      return 'MON';
    case 2:
      return 'FEB';
    case 3:
      return 'WEB';
    case 4:
      return 'THU';
    case 5:
      return 'FRI';
    case 6:
      return 'SAT';
    default:
      return 'N/A';
  }
}

function translateWeatherCode(code: string) {
  const translated = HE_WEATHER_CODES[code] as string | undefined;
  return translated ? translated : 'M';
}
