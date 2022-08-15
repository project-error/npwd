import { useDynamicScript } from '@common/hooks/useDynamicScript';
import React, { lazy, Suspense, useEffect, useRef, forwardRef } from 'react';

export const loadComponent = (scope, module, props, addConfig, ref) => {
  return async (): Promise<any> => {
    await __webpack_init_sharing__('default');
    const container = window[scope];

    console.log('container', container);

    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();

    const appConfig = Module.default();

    const AppModule = Module.default(props).app;

    const App = () => React.createElement(AppModule, props);

    return {
      default: (props: any) => {
        console.log('app props', props);
        const App = React.createElement(AppModule, props);
        ref.current['npwd_esx_garage'] = appConfig;

        return App;
      },
    };
  };
};

export const loadConfig = async (scope, module) => {
  await __webpack_init_sharing__('default');
  const container = window[scope];

  console.log('container', container);

  await container.init(__webpack_share_scopes__.default);
  const factory = await window[scope].get(module);
  const Module = factory();

  console.log('module', module);
  console.log('module bro', Module.default);
  console.log('module id', Module.default().id);
  console.log('module path', Module.default().path);
  console.log('module app', Module.default().app);

  const config = Module.default();
  console.log('typeof created app', typeof config);

  return config;
};

export async function ConfigLoader(config) {
  const appConfig: any = await loadConfig(config.scope, config.module);

  return appConfig;
}

const ModuleLoader = forwardRef((config: any, ref: any) => {
  console.log('loader config', config);
  const { ready, failed } = useDynamicScript({
    url: config.module && config.url,
  });

  if (!config.module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {config.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {config.url}</h2>;
  }

  console.log('forwared ref', ref);

  const Component: any = lazy(
    loadComponent(config.scope, config.module, config.props, config.addConfig, config.forwardRef),
  );
  console.log('comp', Component);
  console.log('typeof comp', typeof Component);

  return (
    <Suspense fallback="Loading Module">
      <Component ref={config.forwardRef} {...config.props} />
    </Suspense>
  );
});

export default ModuleLoader;
