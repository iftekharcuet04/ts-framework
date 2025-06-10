const serviceInstances = new Map<Function, any>();

export function Injectable(): ClassDecorator {
  return (target) => {
    // Register service class as singleton
    serviceInstances.set(target, null);
  };
}

export function getService<T>(target: new (...args: any[]) => T): T {
  if (!serviceInstances.has(target)) {
    throw new Error(`Service ${target.name} not registered`);
  }

  let instance = serviceInstances.get(target);
  if (!instance) {
    instance = new target();
    serviceInstances.set(target, instance);
  }
  return instance;
}


const injectionMetadata = new Map<
  Function,
  { propertyKey: string | symbol; serviceClass: any }[]
>();

export function Inject(serviceClass: any): PropertyDecorator {
  return (target, propertyKey) => {
    const constructor = target.constructor;
    const injections = injectionMetadata.get(constructor) || [];
    injections.push({ propertyKey, serviceClass });
    injectionMetadata.set(constructor, injections);
  };
}

export function injectServices(instance: any) {
  const injections = injectionMetadata.get(instance.constructor) || [];
  for (const { propertyKey, serviceClass } of injections) {
    instance[propertyKey] = getService(serviceClass);
  }
}
