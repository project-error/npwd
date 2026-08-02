import { Button } from '@npwd/keyos';
import { RefreshCw } from 'lucide-react';
import React from 'react';
import { TFunction } from 'react-i18next';

interface ExternalAppBoundaryProps {
  children: React.ReactNode;
  color: string;
  background: string;
  t: TFunction;
}

export class ExternalAppBoundary extends React.Component<ExternalAppBoundaryProps> {
  state = {
    hasError: false,
    errorMsg: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex max-h-full flex-1 flex-col items-center justify-center bg-[length:400%_400%] animate-[gradient_8s_ease_infinite] [&_code]:mt-auto [&_code]:bg-black/50 [&_code]:p-6 [&_code]:text-[0.8rem] [&_code]:text-[#f32d2d]"
          style={{
            background: this.props.background ?? '#222',
            color: this.props.color ?? '#fff',
          }}
        >
          <div className="mt-[15%] flex flex-col items-center gap-4 text-center">
            <div className="p-4">
              <h5 className="text-[length:var(--keyos-text-title)] font-semibold text-current">
                {this.props.t('MISC.APP_CRASHED_TITLE')}
              </h5>
              <p className="text-[length:var(--keyos-text-caption)] text-current">
                {this.props.t('MISC.APP_CRASHED_MSG')}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => this.setState({ hasError: false })}
              variant="ghost"
            >
              <RefreshCw className="size-4" />
              {this.props.t('MISC.APP_CRASHED_ACTION')}
            </Button>
          </div>

          <code>{this.state.errorMsg}</code>
        </div>
      );
    }

    return this.props.children;
  }
}
