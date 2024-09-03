import React from "react";
import { useListingValue } from "../../hooks/state";
import { MarketplaceItem } from "./MarketplaceItem";

export const MarketplaceList: React.FC = () => {
	const listings = useListingValue();

	return (
		<div className="w-full">
			{listings.map((listing) => (
				<MarketplaceItem key={listing.id} {...listing} />
			))}
		</div>
	);
};
