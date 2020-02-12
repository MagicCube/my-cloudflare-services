import {
  handleIndex,
  handleStock,
  handleWeatherForecast,
  handleWeatherNow
} from './handlers';

import Router from './router';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  const router = new Router();
  router.get('/', handleIndex);
  router.get('/stock', handleStock);
  router.get('/weather', handleWeatherNow);
  router.get('/weather/now', handleWeatherNow);
  router.get('/weather/forecast', handleWeatherForecast);
  let response = await router.route(request);
  if (!response) {
    response = new Response('Not found', { status: 404 });
  }
  return response;
}
