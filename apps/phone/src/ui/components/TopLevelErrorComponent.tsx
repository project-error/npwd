import React from 'react';
import { useTranslation } from 'react-i18next';
import { captureException } from '@sentry/react';
import { Button, Dialog, DialogDescription, DialogTitle } from '@npwd/keyos';

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
    <Dialog container={document.getElementById('phone')} open={isOpen} showClose={false}>
      <DialogTitle className="pr-8 text-xl font-bold text-keyos-amber">
        {t('MISC.TOP_LEVEL_ERR_TITLE')}
      </DialogTitle>
      <DialogDescription className="mt-3 text-sm leading-relaxed text-keyos-cream">
        {t('MISC.TOP_LEVEL_ERR_MSG')}
      </DialogDescription>
      <code className="mt-4 block max-h-40 overflow-auto rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200">
        {errorMsg}
      </code>
      <div className="mt-5 flex justify-end">
        <Button onClick={handleReloadClick}>{t('MISC.TOP_LEVEL_ERR_ACTION')}</Button>
      </div>
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
