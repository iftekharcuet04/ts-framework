import { getControllers } from './decorator';
import { injectServices } from './di';
import { Router } from './router';

export function registerDecoratedControllers(router: Router) {
  const controllers = getControllers();

  for (const controllerMeta of controllers) {
    const instance = new controllerMeta.target();
    injectServices(instance); // Inject services here

    for (const route of controllerMeta.routes) {
      const fullPath = controllerMeta.basePath + route.path;

      router.addRoute(route.method, fullPath, (req, params) => {
        return instance[route.handlerName](req, params);
      });
    }
  }
}
