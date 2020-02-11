import config from '../../config';

export async function fetchStock(symbol: string) {
  let res;
  try {
    res = await fetch(
      `https://www.alphavantage.co/query?apikey=${config.stock.apiKey}&function=GLOBAL_QUOTE&symbol=${symbol}`
    );
  } catch (e) {
    console.error(e);
    throw new Error('Fail to connect to www.alphavantage.co.');
  }
  if (res.status === 200) {
    const json = await res.json();
    const raw = json['Global Quote'];
    return {
      symbol: raw['01. symbol'],
      price: parseFloat(raw['05. price']),
      change: parseFloat(raw['09. change']),
      changePercent:
        Math.round(parseFloat(raw['10. change percent']) * 100) / 100
    };
  } else {
    throw new Error(
      `HTTP ${res.status}, fail to load from www.alphavantage.co.`
    );
  }
}
