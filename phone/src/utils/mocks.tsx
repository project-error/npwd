import { MarketplaceListing } from '@typings/marketplace';

export const createMockedMarketplaceListing = (listing?: Partial<MarketplaceListing>) => ({
  id: 1,
  title: 'title1',
  description: 'description1',
  name: 'Charles Carlsberg',
  number: '200-200',
  price: 90000,
  url: 'https://i.file.glass/706Y3.jpeg',
  username: 'unknown',
  identifier: 'unknown',
  ...listing,
});
