import { AppWrapper } from '@ui/components';
import React, { Reducer, useEffect, useReducer, useRef } from 'react';
import { AppContent } from '@ui/components/AppContent';
import { BrowserURLBar } from './BrowserURLBar';
import { promiseTimeout } from '../../../utils/promiseTimeout';
import { usePhone } from '@os/phone/hooks';

interface BrowserState {
  browserUrl: string;
  browserHistory: string[];
}

interface ReducerAction {
  payload: any;
  type: ReducerActionsType;
}

enum ReducerActionsType {
  SET_URL,
  ADD_HISTORY,
  RELOAD,
}

const browserReducer: Reducer<BrowserState, ReducerAction> = (state, action) => {
  switch (action.type) {
    case ReducerActionsType.ADD_HISTORY:
      if (action.payload === 'about:blank') return state;
      return { ...state, browserHistory: state.browserHistory.concat(action.payload) };
    case ReducerActionsType.SET_URL:
      return { ...state, browserUrl: action.payload };
    default:
      throw new Error('Invalid reducer action type');
  }
};

export const BrowserApp: React.FC = () => {
  const { ResourceConfig } = usePhone();

  const [browserState, dispatch] = useReducer(browserReducer, {
    browserUrl: ResourceConfig.browser.homepageUrl ?? '',
    browserHistory: [ResourceConfig.browser.homepageUrl ?? ''],
  });

  const { browserHistory, browserUrl } = browserState;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const _setBrowserUrl = (newUrl: string) => {
    const formattedUrl = newUrl.match(/^(http|https):\/\//) ? newUrl : 'https://' + newUrl;
    dispatch({ payload: browserUrl, type: ReducerActionsType.ADD_HISTORY });
    dispatch({ payload: formattedUrl, type: ReducerActionsType.SET_URL });
  };

  const handleGoBack = () => {
    if (browserHistory.length <= 1) return;
    const lastPage = browserHistory[browserHistory.length - 1];

    if (lastPage === browserUrl) return;
    _setBrowserUrl(lastPage);
  };

  const reloadPage = async () => {
    const strCopy = browserUrl.slice();
    dispatch({ payload: 'about:blank', type: ReducerActionsType.SET_URL });
    await promiseTimeout(100);
    dispatch({ payload: strCopy, type: ReducerActionsType.SET_URL });
  };

  useEffect(() => {
    if (ResourceConfig.browser.homepageUrl) {
      _setBrowserUrl(ResourceConfig.browser.homepageUrl);
    }
  }, [ResourceConfig.browser.homepageUrl]);

  return (
    <AppWrapper id="browser">
      <AppContent className="flex h-full flex-col">
        <BrowserURLBar
          browserUrl={browserUrl}
          browserHasHistory={browserHistory.length > 1}
          setBrowser={_setBrowserUrl}
          goBack={handleGoBack}
          reloadPage={reloadPage}
        />
        <div className="flex-grow">
          <iframe
            is="x-frame-bypass"
            src={browserUrl}
            // @ts-ignore
            className="h-full w-full border-none [zoom:0.5]"
            style={{
              height: '100%',
              width: '100%',
              border: 'none',
            }}
            title="npwd-browser"
            ref={iframeRef}
          />
        </div>
      </AppContent>
    </AppWrapper>
  );
};
