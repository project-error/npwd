import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";
import { MarketplaceEvents, MarketplaceListing } from "@typings/marketplace";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import fetchNui from "../../../../utils/fetchNui";
import { useSnackbar } from "@os/snackbar/hooks/useSnackbar";
import { ServerPromiseResp } from "@typings/common";
import { useMyPhoneNumber } from "@os/simcard/hooks/useMyPhoneNumber";
import { useCall } from "@os/call/hooks/useCall";
import { Tooltip } from "@ui/components/Tooltip";
import { NPWDButton as Button } from "@npwd/keyos";
import { Flag, MessageSquareIcon, PhoneIcon, Trash2 } from "lucide-react";

const useStyles = makeStyles((theme: Theme) => ({
	icon: {
		color: theme.palette.primary.main,
	},
}));

export const ListingActions: React.FC<MarketplaceListing> = ({
	...listing
}) => {
	const classes = useStyles();
	const myNumber = useMyPhoneNumber();
	const [t] = useTranslation();
	const history = useHistory();
	const { initializeCall } = useCall();
	const { addAlert } = useSnackbar();

	const handleDeleteListing = () => {
		fetchNui<ServerPromiseResp>(MarketplaceEvents.DELETE_LISTING, {
			id: listing.id,
		}).then((resp) => {
			if (resp.status !== "ok") {
				return addAlert({
					message: t("MARKETPLACE.FEEDBACK.DELETE_LISTING_FAILED"),
					type: "error",
				});
			}

			addAlert({
				message: t("MARKETPLACE.FEEDBACK.DELETE_LISTING_SUCCESS"),
				type: "success",
			});
		});
	};

	const handleReportListing = () => {
		fetchNui<ServerPromiseResp>(MarketplaceEvents.REPORT_LISTING, {
			id: listing.id,
		}).then((resp) => {
			if (resp.status !== "ok") {
				return addAlert({
					message: t("MARKETPLACE.FEEDBACK.REPORT_LISTING_FAILED"),
					type: "error",
				});
			}

			addAlert({
				message: t("MARKETPLACE.FEEDBACK.REPORT_LISTING_SUCCESS"),
				type: "success",
			});
		});
	};

	const handleCall = () => {
		initializeCall(listing.number);
	};

	const handleMessage = () => {
		history.push(`/messages/new?phoneNumber=${listing.number}`);
	};

	return (
		<div className="items-center justify-between border-t px-2 py-2">
			<div style={{ float: "left" }}>
				{listing.number !== myNumber && (
					<>
						<Tooltip title={t("GENERIC.MESSAGE")}>
							<Button
								onClick={handleMessage}
								variant="ghost"
								className="hover:text-red-400"
							>
								<MessageSquareIcon size={20} />
							</Button>
						</Tooltip>
						<Tooltip title={`${t("GENERIC.CALL")}: ${listing.number}`}>
							<Button
								onClick={handleCall}
								variant="ghost"
								className="hover:text-red-400"
							>
								<PhoneIcon size={20} />
							</Button>
						</Tooltip>
					</>
				)}
			</div>

			<div style={{ float: "right" }}>
				{listing.number === myNumber ? (
					<Tooltip title={t("GENERIC.DELETE")}>
						<Button onClick={handleDeleteListing} variant="ghost">
							<Trash2 size={20} className="text-red-400" />
						</Button>
					</Tooltip>
				) : (
					<Tooltip title={t("GENERIC.REPORT")}>
						<Button
							onClick={handleReportListing}
							variant="ghost"
							className="group hover:text-green-400"
						>
							<Flag size={20} className="group-hover:fill-green-400" />
						</Button>
					</Tooltip>
				)}
			</div>
		</div>
	);
};
