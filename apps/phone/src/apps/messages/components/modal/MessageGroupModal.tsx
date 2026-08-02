import React from 'react';
import NewMessageGroupForm from '../form/NewMessageGroupForm';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';

const MessageGroupModal = () => {
  const { phoneNumber } = useQueryParams<{ phoneNumber?: string }>();

  return (
      <div className="flex h-full w-full animate-in slide-in-from-right-4 flex-col bg-keyos-night text-keyos-cream">
        <React.Suspense fallback={<LoadingSpinner />}>
          <NewMessageGroupForm phoneNumber={phoneNumber} />
        </React.Suspense>
      </div>
  );
};

export default MessageGroupModal;
