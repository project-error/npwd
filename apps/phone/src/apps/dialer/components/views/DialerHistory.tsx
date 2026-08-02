import React, { useCallback, useMemo, useState } from 'react';
import { Badge, Card, CardList, NPWDButton, SegmentedControl } from '@npwd/keyos';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { CallHistoryItem } from '@typings/call';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useDialHistory } from '../../hooks/useDialHistory';
import { useCall } from '@os/call/hooks/useCall';
import { useContacts } from '../../../contacts/hooks/state';
import { ChevronDown, MessageSquare, Phone, PhoneIncoming, PhoneOutgoing, UserRoundPlus } from 'lucide-react';
import { cn } from '@utils/css';

type HistoryFilter = 'all' | 'missed';

export const DialerHistory: React.FC = () => {
  const myNumber = useMyPhoneNumber();
  const { getDisplayByNumber } = useContactActions();
  const { initializeCall } = useCall();
  const calls = useDialHistory();
  const contacts = useContacts();
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const getDisplay = useCallback(
    (number: string) => (contacts.length ? getDisplayByNumber(number) : number),
    [contacts, getDisplayByNumber],
  );

  const filteredCalls = useMemo(() => {
    if (!calls?.length) return [];
    if (filter === 'missed') {
      return calls.filter((call) => call.transmitter !== myNumber && !call.is_accepted);
    }
    return calls;
  }, [calls, filter, myNumber]);

  const handleCall = (phoneNumber: string) => {
    initializeCall(phoneNumber);
  };

  if (!calls?.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="text-[length:var(--keyos-text-body)] text-keyos-muted">
          {t('DIALER.NO_HISTORY')}
        </p>
        <span role="img" aria-label="sad" className="mt-2 text-2xl">
          😞
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-2">
      <div className="mb-4 pt-2">
        <SegmentedControl
          options={[
            { label: t('DIALER.ALL', 'All'), value: 'all' },
            { label: t('DIALER.MISSED', 'Missed'), value: 'missed' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value as HistoryFilter)}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <CardList>
          {filteredCalls.map((call: CallHistoryItem) => {
            const isOutgoing = call.transmitter === myNumber;
            const number = isOutgoing ? call.receiver : call.transmitter;
            const display = call.isAnonymous && !isOutgoing ? 'Anonymous' : getDisplay(number);
            const isExpanded = expandedId === call.id;
            const isMissed = !isOutgoing && !call.is_accepted;

            return (
              <Card key={call.id} padding="none" className="overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-[color:var(--keyos-hover)]"
                  onClick={() => setExpandedId(isExpanded ? null : call.id)}
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--keyos-app-surface)] text-[color:var(--keyos-app-accent)]">
                    {isOutgoing ? <PhoneOutgoing className="size-5" /> : <PhoneIncoming className="size-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[length:var(--keyos-text-headline)] font-semibold text-keyos-fg">
                      {display}
                    </p>
                    <p className="mt-0.5 text-[length:var(--keyos-text-caption)] text-keyos-muted">
                      {dayjs.unix(parseInt(call.start)).format('MMM D, h:mm A')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={isMissed ? 'danger' : isOutgoing ? 'success' : 'accent'}>
                      {isMissed ? 'Missed' : isOutgoing ? 'Outgoing' : 'Incoming'}
                    </Badge>
                    <ChevronDown
                      className={cn('size-4 text-keyos-muted transition-transform', isExpanded && 'rotate-180')}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[color:var(--keyos-border-subtle)] px-4 py-3">
                    <div className="mb-3 flex items-center justify-between text-[length:var(--keyos-text-caption)] text-keyos-muted">
                      <span>Duration</span>
                      <span>
                        {call.end && call.start
                          ? `${Math.max(0, call.end - parseInt(call.start))}s`
                          : '—'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <NPWDButton
                        variant="secondary"
                        className="h-11 rounded-[var(--keyos-radius-md)]"
                        onClick={() => navigate(`/messages/new?number=${number}`)}
                      >
                        <MessageSquare className="size-4" />
                        Message
                      </NPWDButton>
                      <NPWDButton
                        variant="accent"
                        className="h-11 rounded-[var(--keyos-radius-md)]"
                        onClick={() => handleCall(number)}
                        disabled={call.isAnonymous && !isOutgoing}
                      >
                        <Phone className="size-4" />
                        Call
                      </NPWDButton>
                    </div>
                    {!call.isAnonymous && display === number && (
                      <NPWDButton
                        variant="ghost"
                        className="mt-2 h-10 w-full rounded-[var(--keyos-radius-md)]"
                        onClick={() =>
                          navigate(`/contacts/-1?addNumber=${number}&referal=/phone/contacts`)
                        }
                      >
                        <UserRoundPlus className="size-4" />
                        Add contact
                      </NPWDButton>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </CardList>
      </div>
    </div>
  );
};
