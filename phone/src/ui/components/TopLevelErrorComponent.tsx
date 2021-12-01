import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { captureException } from '@sentry/react';

interface TopLevelErrorCompProps {
  hasError: boolean;
  errorMsg: string;
}

interface ErrorDialogCompProps {
  isOpen: boolean;
  errorMsg: string;
}

const ErrorDialogComp: React.FC<ErrorDialogCompProps> = ({ isOpen, errorMsg }) => {
  const [t] = useTranslation();

  const handleReloadClick = () => window.location.reload();

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{t('MISC.TOP_LEVEL_ERR_TITLE')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('MISC.TOP_LEVEL_ERR_MSG')}
          <br />
          <br />
          <code style={{ color: 'red' }}>{errorMsg}</code>
        </DialogContentText>
        <DialogActions>
          <Button color="primary" onClick={handleReloadClick}>
            {t('MISC.TOP_LEVEL_ERR_ACTION')}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export class TopLevelErrorComponent extends React.Component<any, TopLevelErrorCompProps> {
  public state = {
    hasError: false,
    errorMsg: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, { componentStack }: React.ErrorInfo) {
    captureException(error, { contexts: { react: { componentStack } } });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDialogComp isOpen={this.state.hasError} errorMsg={this.state.errorMsg} />;
    }

    return this.props.children;
  }
}
