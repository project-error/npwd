import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { ListItem } from '@ui/components/ListItem';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { MarketplaceListing } from '@typings/marketplace';
import { ListingActions } from './ListingActions';
import { PictureReveal } from '@ui/components/PictureReveal';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: 'hidden',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '3px',
  },
  content: {
    display: 'flex',
    flexFlow: 'column nowrap',
    width: '100%',
  },
  paper: {
    overflow: 'auto',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex',
    borderWidth: 2,
    height: 'auto',
    background: theme.palette.background.paper,
    marginBottom: 20,
  },
  listingContent: {
    padding: 10,
    minWidth: 100,
    maxWidth: '100%',
    width: '100%',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
  },
}));

export const MarketplaceItem: React.FC<MarketplaceListing> = ({ children, ...listing }) => {
  const classes = useStyles();
  const [t] = useTranslation();

  return (
    <ListItem className={classes.root}>
      <div className="flex w-full flex-col">
        <div className="mb-4 flex h-auto flex-col overflow-auto rounded border dark:border-neutral-800 dark:bg-neutral-900">
          <div style={{ margin: 10 }}>
            <h2 style={{ margin: 5 }} className="text-sm dark:text-neutral-50">
              {listing.name}
            </h2>
            <p style={{ padding: 5 }} className="text-base font-medium text-neutral-400">
              {listing.title}
            </p>
          </div>

          {listing.url ? (
            <PictureReveal>
              <PictureResponsive src={listing.url} alt={`${listing.name}`} />
            </PictureReveal>
          ) : (
            <p className="p-4 text-sm dark:text-red-400">
              {t('MARKETPLACE.NO_IMAGE')}
              <span role="img" aria-label="emoji">
                :(
              </span>
            </p>
          )}

          <p className="max-w-full break-words p-4 text-sm dark:text-neutral-50">
            {listing.description}
          </p>
          <ListingActions {...listing} />
        </div>
      </div>
    </ListItem>
  );
};
