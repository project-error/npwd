import { AppWrapper } from '../../../ui/components';
import React, { Reducer, useReducer, useRef } from 'react';
import { AppContent } from '../../../ui/components/AppContent';
import { Box, makeStyles } from '@material-ui/core';
import { BrowserURLBar } from './BrowserURLBar';
import { promiseTimeout } from '../../../utils/promiseTimeout';
import { usePhoneConfig } from '../../../config/hooks/usePhoneConfig';

const useStyles = makeStyles(() => ({
  iframe: {
    height: '100%',
    width: '100%',
    zoom: 0.5,
    border: 'none',
  },
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

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
  const classes = useStyles();
  const [{ appSettings }] = usePhoneConfig();
  const [browserState, dispatch] = useReducer(browserReducer, {
    browserUrl: appSettings.browserHomePage,
    browserHistory: [appSettings.browserHomePage],
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
    // Get last page from history
    const lastPage = browserHistory[browserHistory.length - 1];

    // Bail if last page is same as current
    if (lastPage === browserUrl) return;
    _setBrowserUrl(lastPage);
  };

  const reloadPage = async () => {
    const strCopy = browserUrl.slice();
    dispatch({ payload: 'about:blank', type: ReducerActionsType.SET_URL });
    await promiseTimeout(100);
    dispatch({ payload: strCopy, type: ReducerActionsType.SET_URL });
  };

  return (
    <AppWrapper id="browser">
      <AppContent className={classes.root}>
        <BrowserURLBar
          browserUrl={browserUrl}
          browserHasHistory={browserHistory.length > 1}
          setBrowser={_setBrowserUrl}
          goBack={handleGoBack}
          reloadPage={reloadPage}
        />
        <Box flexGrow={1}>
          <iframe
            is="x-frame-bypass"
            src={browserUrl}
            // @ts-ignore
            className={classes.iframe}
            title="npwd-browser"
            ref={iframeRef}
          />
        </Box>
      </AppContent>
    </AppWrapper>
  );
};
