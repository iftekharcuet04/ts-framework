import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { parse } from "url";
import { RadixNode } from "./radix-node";
import { Handler } from "./types/route-types";

export class Router {
  private root = new RadixNode(''); // root node
  
  private server?: Server;

  public addRoute(method: string, path: string, handler: Handler) {
    const segments = path.split('/').filter(Boolean);
    // console.log('root', this.root);
    let currentNode = this.root;

    for (const segment of segments) {
      currentNode = RadixNode.create(segment, currentNode);
    }

    currentNode.handler = handler;
    currentNode.method = method.toUpperCase();
  }

  private matchRoute(
    method: string,
    segments: string[]
  ): { node: RadixNode; params: Record<string, string> } | null {
    let currentNode = this.root;
    const params: Record<string, string> = {};
  
    for (const segment of segments) {
      if (currentNode.staticChildren.has(segment)) {
        currentNode = currentNode.staticChildren.get(segment)!;
      }
      // Then try param match
      else if (currentNode.paramChild) {
        currentNode = currentNode.paramChild;
        if (currentNode.paramName) {
          params[currentNode.paramName] = segment;
        }
      }
      // No match
      else {
        return null;
      }
    }
  
    if (currentNode.handler && currentNode.method === method) {
      return { node: currentNode, params };
    }
  
    return null;
  }
  

  private async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method?.toUpperCase() || '';
    const pathname = parse(req.url || '/', true).pathname || '/';
    const segments = pathname.split('/').filter(Boolean);

    const matched = this.matchRoute(method, segments);

    if (matched) {
      try {
        const data = await matched.node.handler!(req, matched.params);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        console.error(e);
      }
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Not Found' }));
    }

    console.log(`Request: ${method} ${pathname}`);
  }

  public listen(port: number, callback?: () => void) {
    if (this.server) {
      throw new Error('Server already running');
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
