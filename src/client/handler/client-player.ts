import { netEventController } from "../event/netEventController";

type OpenPhoneData = {
	message: string;
};

// asume this is an exported function
async function nuiProxyController(data: any) {
	const resp = await netEventController<OpenPhoneData>("openPhone", data);

	console.log(resp.message);
}
