type RouterFunction = (...args: any[]) => Promise<any>;
type FunctionWithEmit<T extends RouterFunction> = {
  emit: T;
  emitNet: T;
};
type NestedRouter = Record<string, FunctionWithEmit<RouterFunction>>;
type RouterFunctions = Record<string, FunctionWithEmit<RouterFunction> | NestedRouter>;

function createdFunctionWithEmit<T extends RouterFunction>(fn: T): FunctionWithEmit<T> {
  return {
    emit: ((...args: Parameters<T>): Promise<ReturnType<T>> => {
      console.log('emit', args);
      return fn(...args);
    }) as T,
    emitNet: ((...args: Parameters<T>): Promise<ReturnType<T>> => {
      console.log('emitNet', args);
      return fn(...args);
    }) as T,
  };
}

function eventProcedure<T extends RouterFunction>(event: string, callback: T): FunctionWithEmit<T> {
  // uhh what to do here
  onNet(event, callback);
  return createdFunctionWithEmit(callback);
}

function createRouter() {
  return function <T extends RouterFunctions>(routes: T): T {
    const processedRoutes: Partial<RouterFunctions> = {};

    for (const key in routes) {
      const route = routes[key];
      if (typeof route === 'function') {
        processedRoutes[key] = route;
      } else {
        Object.assign(processedRoutes, route);
      }
    }

    return processedRoutes as T;
  };
}

class RouterBuilder {
  create() {
    return {
      router: createRouter(),
      eventProcedure: eventProcedure,
    };
  }
}

export const initRouter = new RouterBuilder();

export function createClient<
  T extends Record<string, FunctionWithEmit<(...args: any[]) => Promise<any>> | NestedRouter>,
>(): T {
  return {} as T;
}
