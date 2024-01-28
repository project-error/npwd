import { ActiveCall, CallEvents, InitializeCallDTO, OnCallStatus } from "@typings/call";
import { CallMiddleware } from "./index";
import { PromiseEventResp, PromiseRequest } from "../../lib/PromiseNetEvents/promise.types";
import PlayerService from "../../players/player.service";
import { uuidv4 } from "../../../utils/fivem";
import { callLogger } from "../calls.utils";

class OnCallService {
  private callHandlers: Map<string, CallMiddleware[]>
  private resourcesTracked: Set<string>

  constructor() {
    this.callHandlers = new Map()
    this.resourcesTracked = new Set()
  }

  addHandler(handler: CallMiddleware) {
    this.resourcesTracked.add(handler.hostResource)

    if (this.callHandlers.has(handler.target)){
      const handlerList = this.callHandlers.get(handler.target)
      handlerList.push(handler)

      return
    }

    this.callHandlers.set(handler.target, [handler])
  }

  // Keep a set containing all the resources we are tracking so that we are not doing an O(n^2) compute unnecessarily
  resetResource(resource: string) {
    if (!this.resourcesTracked.has(resource)) return;

    this.callHandlers.forEach((value, key, map) => {
      const newList = value.filter(c => c.hostResource !== resource)
      map.set(key, newList)
    })
  }

  async handle(
         reqObj: PromiseRequest<InitializeCallDTO>,
         resp: PromiseEventResp<ActiveCall>
  ) {
    callLogger.debug("invoking onCall for number", reqObj.data.receiverNumber)
    if (!this.callHandlers.has(reqObj.data.receiverNumber)) {
      return
    }

    const caller = PlayerService.getPlayer(reqObj.source);

    const incomingCaller = {
      source: reqObj.source,
      name: caller.getName(),
      number: caller.getPhoneNumber(),
    };

    const handlerList = this.callHandlers.get(reqObj.data.receiverNumber)
    console.log(handlerList.length)
    for (const handler of handlerList) {
      try {
        const status = await handler.invoke(incomingCaller, reqObj, resp)
        if (status === OnCallStatus.FORWARD) {
          break;
        }
      } catch (e) {
        const tempSaveCallObj = {
          identifier: uuidv4(),
          isTransmitter: true,
          transmitter: incomingCaller.number,
          receiver: reqObj.data.receiverNumber,
          is_accepted: false,
          isUnavailable: true,
          start: Math.floor(new Date().getTime() / 1000).toString(),
        };

        resp({
          status: 'ok',
          data: tempSaveCallObj,
        });

        return setTimeout(() => {
          emitNet(CallEvents.WAS_REJECTED, reqObj.source, tempSaveCallObj);
        }, 2000);
      }
    }
  }
}

export default new OnCallService()