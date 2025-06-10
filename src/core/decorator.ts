// src/decorators.ts

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RouteDefinition {
  path: string;
  method: HttpMethod;
  handlerName: string | symbol;
}

const controllers: Array<{ target: any; basePath: string; routes: RouteDefinition[] }> = [];

export function Controller(basePath: string): ClassDecorator {
  return (target) => {
    controllers.push({ target, basePath, routes: [] });
  };
}

function createMethodDecorator(method: HttpMethod) {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      // Find controller metadata and add route info
      const controller = controllers.find(c => c.target === target.constructor);
      if (!controller) {
        // If controller decorator not yet applied, add it here with empty basePath
        controllers.push({
          target: target.constructor,
          basePath: '',
          routes: [{ path, method, handlerName: propertyKey }],
        });
      } else {
        controller.routes.push({ path, method, handlerName: propertyKey });
      }
    };
  };
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');

export function getControllers() {
  return controllers;
}
