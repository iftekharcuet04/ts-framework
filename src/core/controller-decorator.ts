type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RouteDefinition {
  path: string;
  method: HttpMethod;
  handlerName: string | symbol;
}

interface ControllerMeta {
  target: any;
  basePath: string;
  routes: RouteDefinition[];
}

const controllers = new Map<Function, ControllerMeta>();

export function Controller(basePath: string): ClassDecorator {
  return (target) => {
    const existing = controllers.get(target) || { target, basePath, routes: [] };
    existing.basePath = basePath; // update if added earlier by method decorator
    controllers.set(target, existing);
  };
}

function createMethodDecorator(method: HttpMethod) {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const controllerClass = target.constructor;
      const existing = controllers.get(controllerClass) || {
        target: controllerClass,
        basePath: '', // default
        routes: [],
      };
      existing.routes.push({ path, method, handlerName: propertyKey });
      controllers.set(controllerClass, existing);
    };
  };
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');

export function getControllers(): ControllerMeta[] {
  return [...controllers.values()];
}
