import React from 'react';
import { MessageSquare, Phone, Trash2, Flag } from 'lucide-react';
import { MarketplaceListing } from '@typings/marketplace';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import fetchNui from '../../../../utils/fetchNui';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useCall } from '@os/call/hooks/useCall';
import { Tooltip } from '@ui/components/Tooltip';
import { Button } from '@ui/components/Button';
import { MarketplaceEvents } from '@typings/marketplace';

export const ListingActions: React.FC<MarketplaceListing> = ({ children, ...listing }) => {
  const myNumber = useMyPhoneNumber();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { initializeCall } = useCall();
  const { addAlert } = useSnackbar();

  const handleDeleteListing = () => {
    fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
      id: listing.id,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_FAILED'),
          type: 'error',
        });
      }

      addAlert({
        message: t('MARKETPLACE.FEEDBACK.DELETE_LISTING_SUCCESS'),
        type: 'success',
      });
    });
  };

  const handleReportListing = () => {
    fetchNui<ServerPromiseResp>(MarketplaceEvents.REPORT_LISTING, {
      id: listing.id,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_FAILED'),
          type: 'error',
        });
      }

      addAlert({
        message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_SUCCESS'),
        type: 'success',
      });
    });
  };

  const handleCall = () => {
    initializeCall(listing.number);
  };

  const handleMessage = () => {
    navigate(`/messages/new?phoneNumber=${listing.number}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="float-left">
        {listing.number !== myNumber && (
          <>
            <Tooltip title={t('GENERIC.MESSAGE')}>
              <Button onClick={handleMessage} variant="text">
                <MessageSquare className="text-[color:var(--keyos-app-accent)]" />
              </Button>
            </Tooltip>
            <Tooltip title={`${t('GENERIC.CALL')}: ${listing.number}`}>
              <Button onClick={handleCall} variant="text">
                <Phone className="text-[color:var(--keyos-app-accent)]" />
              </Button>
            </Tooltip>
          </>
        )}
      </div>

      <div className="float-right">
        {listing.number === myNumber ? (
          <Tooltip title={t('GENERIC.DELETE')}>
            <Button onClick={handleDeleteListing} variant="text">
              <Trash2 />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title={t('GENERIC.REPORT')}>
            <Button onClick={handleReportListing} variant="text">
              <Flag />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
