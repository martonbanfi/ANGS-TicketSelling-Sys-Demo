import { ENFTTicket } from '../model/eNFTTicket.ts';
import { MReqCreateEvent } from '../model/mReqCreateEvent.ts';
import { EEvent } from '../model/eEvent.ts';
import { ld } from 'https://deno.land/x/deno_lodash/mod.ts';

/**
 * This Class is responsible for holding MReqCreateEvent blockchain type on the client side (website)
 * 
 */
class MReqCreateEventClass implements MReqCreateEvent{
    
  constructor(data: MReqCreateEvent) {
    Object.assign(this, data);
  }

  public getData(): MReqCreateEvent {
    return this;
  }
}
export default MReqCreateEventClass;
