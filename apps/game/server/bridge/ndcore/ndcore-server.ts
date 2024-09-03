import { config } from "@npwd/config/server";
import PlayerService from "../../players/player.service";
import { mainLogger } from "../../sv_logger";
import { Strategy } from "../framework-strategy";

type NDPlayer = {
	id: number;
	source: number;
	identifier: string;
	nickname: string;
	user: string;
	roles: unknown;
	name: string;
	firstname: string;
	lastname: string;
	fullname: string;
	dob: string;
	gender: string;
	phonenumber: string;
	cash: number;
	bank: number;
	groups: unknown;
	job: string;
	jobInfo: unknown;
	label: string;
	rankName: string;
	rank: number;
	metadata: unknown;
	inventory: unknown;
};

// and this phone was supposed to be a 100% standalone my ass
export class NDCoreFramework implements Strategy {
	constructor() {
		mainLogger.info("Loading NDCore bridge....");

		config.general.useResourceIntegration = true;
		config.database.identifierColumn = "charid";
		config.database.phoneNumberColumn = "phonenumber";
		config.database.playerTable = "nd_characters";
		config.database.identifierType = "license";
	}

	init(): void {
		on("ND:characterLoaded", async (player: NDPlayer) => {
			const playerIdent = player.id;
			const phoneNumber = player?.phonenumber;
			const playerSrc = player.source;

			await PlayerService.handleNewPlayerEvent({
				identifier: playerIdent.toString(),
				source: playerSrc,
				phoneNumber: phoneNumber ?? null,
				firstname: player.firstname,
				lastname: player.lastname,
			});
		});

		on("ND:characterUnloaded", async (source: number) => {
			await PlayerService.handleUnloadPlayerEvent(source);
		});

		mainLogger.info("NDCore bridge initialized");
	}

	onStart(): void {
		on("onServerResourceStart", async (resource: string) => {
			const NDCore = global.exports["ND_Core"];

			if (resource === GetCurrentResourceName()) {
				const onlinePlayers = NDCore.getPlayers() as NDPlayer[];
				for (const player of onlinePlayers) {
					const phoneNumber = player?.phonenumber;

					await PlayerService.handleNewPlayerEvent({
						source: player.source,
						identifier: player.id.toString(),
						phoneNumber: phoneNumber ?? null,
						firstname: player.firstname,
						lastname: player.lastname,
					});
				}
			}
		});
	}
}
