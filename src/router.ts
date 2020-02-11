/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */

type RouteHandler = (request: Request) => Response | Promise<Response>;
type Conditions = [(req: Request) => boolean, (req: Request) => boolean] | [];

interface Route {
  conditions: Conditions;
  handler: RouteHandler;
}

const Method = (method: string) => (req: Request) =>
  req.method.toLowerCase() === method.toLowerCase();
const CONNECT = Method('connect');
const DELETE = Method('delete');
const GET = Method('get');
const HEAD = Method('head');
const OPTIONS = Method('options');
const PATCH = Method('patch');
const POST = Method('post');
const PUT = Method('put');
const TRACE = Method('trace');

const Header = (header: string, val: string) => (req: Request) =>
  req.headers.get(header) === val;
const Host = (host: string) => Header('host', host.toLowerCase());
const Referrer = (host: string) => Header('referrer', host.toLowerCase());

const Path = (regExp: string | RegExp) => (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const match = path.match(regExp) || [];
  return match[0] === path;
};

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
class Router {
  routes: Route[] = [];

  handle(conditions: Conditions, handler: RouteHandler) {
    this.routes.push({
      conditions,
      handler
    });
    return this;
  }

  connect(url: string | RegExp, handler: RouteHandler) {
    return this.handle([CONNECT, Path(url)], handler);
  }

  delete(url: string | RegExp, handler: RouteHandler) {
    return this.handle([DELETE, Path(url)], handler);
  }

  get(url: string | RegExp, handler: RouteHandler) {
    return this.handle([GET, Path(url)], handler);
  }

  head(url: string | RegExp, handler: RouteHandler) {
    return this.handle([HEAD, Path(url)], handler);
  }

  options(url: string | RegExp, handler: RouteHandler) {
    return this.handle([OPTIONS, Path(url)], handler);
  }

  patch(url: string | RegExp, handler: RouteHandler) {
    return this.handle([PATCH, Path(url)], handler);
  }

  post(url: string | RegExp, handler: RouteHandler) {
    return this.handle([POST, Path(url)], handler);
  }

  put(url: string | RegExp, handler: RouteHandler) {
    return this.handle([PUT, Path(url)], handler);
  }

  trace(url: string | RegExp, handler: RouteHandler) {
    return this.handle([TRACE, Path(url)], handler);
  }

  all(handler: RouteHandler) {
    return this.handle([], handler);
  }

  route(req: Request) {
    const route = this.resolve(req);

    if (route) {
      return route.handler(req);
    }

    return new Response('resource not found', {
      status: 404,
      statusText: 'not found',
      headers: {
        'content-type': 'text/plain'
      }
    });
  }

  /**
   * resolve returns the matching route for a request that returns
   * true for all conditions (if any).
   */
  resolve(req: Request) {
    return this.routes.find(r => {
      if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
        return true;
      }

      return r.conditions.every(c => c(req));
    });
  }
}

export default Router;
