import { getControllers } from './controller-decorator';
import { injectServices } from './di';
import { Router } from './router';

export function registerDecoratedControllers(router: Router) {
  const controllers = getControllers();

  for (const controllerMeta of controllers) {
    const instance = new controllerMeta.target();
    injectServices(instance); // Inject services here

    const sortedRoutes = [...controllerMeta.routes].sort((a, b) => {
      const aParam = a.path.includes(':');
      const bParam = b.path.includes(':');
      return Number(aParam) - Number(bParam);
    });

    // Register routes
    for (const route of sortedRoutes) {
      const fullPath = (controllerMeta.basePath + route.path).replace(/\/+$/, '') || '/';
      router.addRoute(route.method, fullPath, (req, params) => {
        return instance[route.handlerName](req, params);
      });
    }
  }
}
