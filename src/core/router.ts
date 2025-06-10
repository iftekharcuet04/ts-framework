import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { parse } from 'url';

type Handler = (
  req: IncomingMessage,
  params: Record<string, string>
) => any | Promise<any>; // Return any data (sync or async)

interface Route {
  method: string;
  path: string;
  handler: Handler;
  paramNames: string[];
  regex: RegExp;
}

export class Router {
  private routes: Route[] = [];
  private server?: Server;

  public addRoute(method: string, path: string, handler: Handler) {
    const { regex, paramNames } = this.pathToRegex(path);
    this.routes.push({ method: method.toUpperCase(), path, handler, regex, paramNames });
  }

  private pathToRegex(path: string) {
    const paramNames: string[] = [];
    const regexStr = path.replace(/:([^\/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^\\/]+)';
    });
    return { regex: new RegExp(`^${regexStr}$`), paramNames };
  }

  private async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method?.toUpperCase() || '';
    const url = req.url || '/';
    const pathname = parse(url).pathname || '/';

    for (const route of this.routes) {
      if (route.method === method) {
        const match = route.regex.exec(pathname);
        if (match) {
          const params: Record<string, string> = {};
          route.paramNames.forEach((name, i) => {
            params[name] = match[i + 1];
          });

          try {
            const data = await route.handler(req, params);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            console.error(e);
          }
          return;
        }
      }
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not Found' }));
  }

  public listen(port: number, callback?: () => void) {
    if (this.server) {
      throw new Error('Server is already running');
    }
    this.server = createServer(this.handle.bind(this));
    this.server.listen(port, callback);
  }

  public close(callback?: () => void) {
    if (this.server) {
      this.server.close(callback);
      this.server = undefined;
    }
  }
}
