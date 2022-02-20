import { Close } from '@mui/icons-material';
import { Button, IconButton, Stack, StackProps, styled } from '@mui/material';
import { useApp } from '@os/apps/hooks/useApps';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { MarketplaceEvents } from '@typings/marketplace';
import fetchNui from '@utils/fetchNui';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

type ContainerProps = StackProps & { hasImage: boolean };
const Container = styled(({ hasImage, ...rest }: ContainerProps) => <Stack {...rest} />)(
  (props) => ({
    zIndex: 1,
    position: props.hasImage ? 'absolute' : 'initial',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1rem 1rem 0',
  }),
);

const CloseIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

interface MarketplaceListingHeaderProps {
  hasImage: boolean;
  isMyListing: boolean;
}
const MarketplaceListingHeader = ({ isMyListing, hasImage }: MarketplaceListingHeaderProps) => {
  const { t } = useTranslation();
  const { addAlert } = useSnackbar();
  const { path } = useApp('MARKETPLACE');
  const { push } = useHistory();
  const { id } = useParams<{ id: string }>();

  const handleReportListing = async () => {
    try {
      const response = await fetchNui<ServerPromiseResp>(MarketplaceEvents.REPORT_LISTING, {
        id,
      });

      if (response.status !== 'ok') {
        return addAlert({
          message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_FAILED'),
          type: 'error',
        });
      }

      addAlert({
        message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_SUCCESS'),
        type: 'success',
      });
    } catch (err) {
      return addAlert({
        message: t('MARKETPLACE.FEEDBACK.REPORT_LISTING_FAILED'),
        type: 'error',
      });
    }
  };

  return (
    <Container direction="row" hasImage={hasImage}>
      <CloseIcon onClick={() => push(path)}>
        <Close />
      </CloseIcon>

      {isMyListing ? (
        <Button variant="contained" onClick={() => push(`${path}/${id}/edit`)}>
          {t('GENERIC.EDIT')}
        </Button>
      ) : (
        <Button color="error" variant="contained" onClick={handleReportListing}>
          {t('GENERIC.REPORT')}
        </Button>
      )}
    </Container>
  );
};

export default MarketplaceListingHeader;
